'use strict';

const logger = require('../utils/logger');

const { QueryTypes }  = require('sequelize');
const { Op } = require('sequelize');
const { sequelize, Registration, Attendance, Session, User, Notification } = require('../models');
const logActivity     = require('../utils/logActivity');
const { generatePayload, verifyPayload } = require('../utils/qrUtils');
const sseClients      = require('../sseClients');
const env             = require('../config/env');

// SSE helpers

function addSseClient(sessionId, res) {
  if (!sseClients.has(sessionId)) sseClients.set(sessionId, new Set());
  sseClients.get(sessionId).add(res);
}

function removeSseClient(sessionId, res) {
  sseClients.get(sessionId)?.delete(res);
  if (sseClients.get(sessionId)?.size === 0) sseClients.delete(sessionId);
}

function broadcast(sessionId, payload) {
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  sseClients.get(sessionId)?.forEach(res => {
    try { res.write(data); } catch { /* client disconnected mid-write */ }
  });
}

// GET /api/attendance/qr-code/:eventId
exports.getQRCode = async (req, res) => {
  const eventId = parseInt(req.params.eventId, 10);
  if (!Number.isFinite(eventId)) {
    return res.status(400).json({ error: { message: 'Invalid eventId.', code: 'VALIDATION_ERROR' } });
  }

  const userId = req.user.id;

  // Confirm attendee is registered for this event before issuing a QR
  const reg = await Registration.findOne({ where: { userId, eventId } });
  if (!reg) {
    return res.status(403).json({
      error: { message: 'You are not registered for this event.', code: 'FORBIDDEN' },
    });
  }

  // Load studentId from DB — JWT payload only carries sub + role
  const attendee  = await User.findByPk(userId, { attributes: ['studentId'] });
  const studentId = attendee?.studentId ?? '';

  const payload = generatePayload(userId, studentId, eventId);
  return res.json({ payload });
};

// POST /api/attendance/scan
exports.scan = async (req, res) => {
  const { sessionId, attendeeCode } = req.body;

  // 1. Verify HMAC
  let decoded;
  try {
    decoded = verifyPayload(attendeeCode);
  } catch (err) {
    return res.status(403).json({
      error: { message: 'QR code is invalid or has been tampered with.', code: 'INVALID_QR' },
    });
  }

  const { userId, studentId, eventId } = decoded;

  try {
    // 2. Load session and confirm it belongs to the correct event
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ error: { message: 'Session not found.', code: 'NOT_FOUND' } });
    }
    if (session.eventId !== eventId) {
      return res.status(422).json({
        error: { message: 'QR code is for a different event.', code: 'EVENT_MISMATCH' },
      });
    }

    // 3. confirm the attendee is validated for this session.
    // old: only checked event-level registration.  meant that if an attendee
    //      was assigned to a session via the bulk modal but never had a
    //      registration row inserted (edge case), the qr scan would refuse
    //      them even though the spec calls them "validated for session".
    // new: accept EITHER source as proof:
    //        a) a non-cancelled registration for the parent event, OR
    //        b) an explicit session_assignment row for THIS session
    //      so post-hoc bulk-assigned attendees are also recognized.
    const { SessionAssignment } = require('../models');
    const [registration, assignment] = await Promise.all([
      Registration.findOne({ where: { userId, eventId } }),
      SessionAssignment.findOne({ where: { attendeeId: userId, sessionId } }),
    ]);

    const validRegistration = registration && registration.status !== 'Cancelled';
    if (!validRegistration && !assignment) {
      // neither source confirms the attendee belongs to this session
      if (registration?.status === 'Cancelled') {
        return res.status(422).json({
          error: { message: 'Registration has been cancelled.', code: 'REGISTRATION_CANCELLED' },
        });
      }
      return res.status(422).json({
        error: { message: 'Attendee is not registered for this event or session.', code: 'NOT_REGISTERED' },
      });
    }

    // 4. Prevent duplicate check-in
    const existing = await Attendance.findOne({ where: { userId, sessionId } });
    if (existing) {
      const time = existing.checkInTime
        ? new Date(existing.checkInTime).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
        : 'earlier';
      return res.status(409).json({
        error: { message: `Already checked in at ${time}.`, code: 'ALREADY_CHECKED_IN' },
      });
    }

    // 5. Determine Present vs Late
    const now = new Date();
    let status = 'Present';
    if (session.schedule) {
      const lateThreshold = new Date(
        new Date(session.schedule).getTime() + env.LATE_THRESHOLD_MINUTES * 60 * 1000,
      );
      if (now > lateThreshold) status = 'Late';
    }

    // 6. Create attendance record
    const attendance = await Attendance.create({
      userId,
      sessionId,
      status,
      checkInTime: now,
    });

    // 7. Load user info for broadcast and response
    const attendee = await User.findByPk(userId, {
      attributes: ['id', 'fullName', 'studentId', 'department'],
    });

    // 7b. FR-08: create a persisted notification for the attendee so they see
    //      the check-in confirmation on their notifications page immediately.
    //      fire-and-forget — a notification write failure must never fail the scan.
    Notification.create({
      userId,
      type:    status === 'Late' ? 'warning' : 'success',
      title:   status === 'Late' ? 'Late Check-in Recorded' : 'Check-in Confirmed',
      message: `Your attendance for "${session.title || 'the session'}" has been marked ` +
               `${status}. Check-in time: ` +
               `${now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}.`,
      isRead:  false,
    }).catch(err => logger.warn('[scan] notification write failed (non-fatal)', { err: err.message }));

    // 8. SSE broadcast to all clients watching this session
    broadcast(sessionId, {
      type:         'scan',
      attendanceId: attendance.id,
      userId,
      fullName:     attendee?.fullName ?? 'Unknown',
      studentId:    attendee?.studentId ?? studentId,
      status,
      checkInTime:  now.toISOString(),
    });

    // 9. Audit log (non-blocking)
    logActivity(
      req.user.id,
      'ATTENDANCE_SCANNED',
      'Attendance',
      attendance.id,
      `QR check-in for ${attendee?.fullName ?? userId} (session ${sessionId})`,
      { sessionId, status, studentId: attendee?.studentId },
    );

    return res.status(201).json({
      status,
      checkInTime: now.toISOString(),
      fullName:    attendee?.fullName ?? 'Unknown',
      message:     `Checked in at ${now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}`,
    });

  } catch (err) {
    logger.error('[attendanceController.scan]', err);
    return res.status(500).json({
      error: { message: 'Failed to process scan.', code: 'INTERNAL_ERROR' },
    });
  }
};

// GET /api/attendance/session/:id/stream  (SSE)
exports.stream = (req, res) => {
  const sessionId = parseInt(req.params.id, 10);
  if (!Number.isFinite(sessionId)) {
    return res.status(400).json({ error: { message: 'Invalid sessionId.', code: 'VALIDATION_ERROR' } });
  }

  // SSE response headers
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable Nginx buffering
  res.flushHeaders?.();

  // Send initial connected event so the client knows the stream is live
  res.write(`data: ${JSON.stringify({ type: 'connected', sessionId })}\n\n`);

  addSseClient(sessionId, res);

  // Heartbeat every 25s — prevents idle proxy/load-balancer timeouts
  const heartbeat = setInterval(() => {
    try { res.write(`data: ${JSON.stringify({ type: 'ping' })}\n\n`); }
    catch { clearInterval(heartbeat); }
  }, 25_000);

  req.on('close', () => {
    clearInterval(heartbeat);
    removeSseClient(sessionId, res);
  });
};

// GET /api/attendance/session/:id
exports.list = async (req, res) => {
  const sessionId = parseInt(req.params.id, 10);
  if (!Number.isFinite(sessionId)) {
    return res.status(400).json({ error: { message: 'Invalid sessionId.', code: 'VALIDATION_ERROR' } });
  }

  // old: this query filtered by registrations.event_id, so the staff roster
  //      showed EVERY attendee registered for the parent event — even
  //      attendees who were never assigned to this specific session.  that
  //      did not match the spec ("the facilitator for THAT session will see
  //      angelo's name in the live roster").
  // new: filter by the session_assignments table so the roster shows only
  //      attendees explicitly assigned to this session.  we also union in
  //      legacy registrations that have session_id set directly, so old
  //      data created before the assignments table existed still shows up.
  const { q, page = 1, pageSize = 50 } = req.query;
  const limit  = Math.min(100, parseInt(pageSize, 10) || 50);
  const offset = (Math.max(1, parseInt(page, 10)) - 1) * limit;

  const replacements = { sessionId, limit, offset };

  // search filter is applied after the union — both branches must support it
  let searchClause = '';
  if (q) {
    searchClause = ` AND (u.full_name ILIKE :q OR COALESCE(u.student_id,'') ILIKE :q)`;
    replacements.q = `%${q}%`;
  }

  // the inner CTE collects every distinct user who belongs to this session
  // via either source: session_assignments OR registrations.session_id.
  const sessionAttendeeSql = `
    WITH session_attendees AS (
      SELECT DISTINCT attendee_id AS user_id
      FROM session_assignments
      WHERE session_id = :sessionId
      UNION
      SELECT DISTINCT user_id
      FROM registrations
      WHERE session_id = :sessionId AND status != 'Cancelled'
    )
  `;

  try {
    const [rows, countRows] = await Promise.all([
      sequelize.query(
        `${sessionAttendeeSql}
         SELECT
           u.id            AS "userId",
           u.full_name     AS "fullName",
           u.email,
           u.student_id    AS "studentId",
           u.department,
           a.id            AS "attendanceId",
           a.status        AS "attendanceStatus",
           a.check_in_time AS "checkInTime"
         FROM session_attendees sa
         JOIN users u ON u.id = sa.user_id
         LEFT JOIN attendances a
           ON a.user_id = sa.user_id AND a.session_id = :sessionId
         WHERE 1=1${searchClause}
         ORDER BY u.full_name ASC
         LIMIT :limit OFFSET :offset`,
        { type: QueryTypes.SELECT, replacements },
      ),
      sequelize.query(
        `${sessionAttendeeSql}
         SELECT COUNT(*) AS total
         FROM session_attendees sa
         JOIN users u ON u.id = sa.user_id
         WHERE 1=1${searchClause}`,
        { type: QueryTypes.SELECT, replacements },
      ),
    ]);

    const total = parseInt(countRows[0]?.total || 0, 10);
    return res.json({ total, page: parseInt(page, 10), pageSize: limit, rows });

  } catch (err) {
    logger.error('[attendanceController.list]', err);
    return res.status(500).json({
      error: { message: 'Failed to load session attendees.', code: 'INTERNAL_ERROR' },
    });
  }
};

// PUT /api/attendance/:id
exports.update = async (req, res) => {
  const attendanceId = parseInt(req.params.id, 10);
  const { status }   = req.body;

  if (!Number.isFinite(attendanceId)) {
    return res.status(400).json({ error: { message: 'Invalid attendance ID.', code: 'VALIDATION_ERROR' } });
  }

  try {
    const attendance = await Attendance.findByPk(attendanceId, {
      include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'studentId'] }],
    });
    if (!attendance) {
      return res.status(404).json({ error: { message: 'Attendance record not found.', code: 'NOT_FOUND' } });
    }

    const prevStatus = attendance.status;
    attendance.status = status;
    // Set checkInTime if marking Present/Late and none exists yet
    if (['Present', 'Late'].includes(status) && !attendance.checkInTime) {
      attendance.checkInTime = new Date();
    }
    await attendance.save();

    // SSE broadcast so live feed reflects manual overrides
    broadcast(attendance.sessionId, {
      type:         'update',
      attendanceId: attendance.id,
      userId:       attendance.userId,
      fullName:     attendance.user?.fullName ?? 'Unknown',
      studentId:    attendance.user?.studentId ?? null,
      status,
      checkInTime:  attendance.checkInTime?.toISOString() ?? null,
    });

    logActivity(
      req.user.id,
      'ATTENDANCE_OVERRIDDEN',
      'Attendance',
      attendance.id,
      `Manual override for ${attendance.user?.fullName ?? attendance.userId}: ${prevStatus} → ${status}`,
      { sessionId: attendance.sessionId, prevStatus, newStatus: status },
    );

    return res.json({ id: attendance.id, status, checkInTime: attendance.checkInTime });

  } catch (err) {
    logger.error('[attendanceController.update]', err);
    return res.status(500).json({
      error: { message: 'Failed to update attendance.', code: 'INTERNAL_ERROR' },
    });
  }
};

// GET /api/attendance/session/:id/stats
// lightweight aggregate used by the staff scanner present-counter widget.
// returns { checkedIn, total } where:
//   checkedIn = attendees with status Present or Late
//   total     = total attendees assigned to this session (via session_assignments
//               or legacy registrations.session_id)
exports.getSessionStats = async (req, res) => {
  const sessionId = parseInt(req.params.id, 10);
  if (!Number.isFinite(sessionId)) {
    return res.status(400).json({ error: { message: 'Invalid sessionId.', code: 'VALIDATION_ERROR' } });
  }

  try {
    const [checkedIn, totalRows] = await Promise.all([
      Attendance.count({
        where: { sessionId, status: { [Op.in]: ['Present', 'Late'] } },
      }),
      sequelize.query(
        `SELECT COUNT(*) AS total
         FROM (
           SELECT DISTINCT attendee_id AS user_id
           FROM   session_assignments
           WHERE  session_id = :sessionId
           UNION
           SELECT DISTINCT user_id
           FROM   registrations
           WHERE  session_id = :sessionId AND status != 'Cancelled'
         ) combined`,
        { type: QueryTypes.SELECT, replacements: { sessionId } }
      ),
    ]);

    return res.json({
      checkedIn,
      total: parseInt(totalRows[0]?.total || 0, 10),
    });
  } catch (err) {
    logger.error('[attendanceController.getSessionStats]', err);
    return res.status(500).json({ error: { message: 'Failed to load stats.', code: 'INTERNAL_ERROR' } });
  }
};

