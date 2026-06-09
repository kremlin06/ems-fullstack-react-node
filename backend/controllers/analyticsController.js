'use strict';

const { Op, QueryTypes } = require('sequelize');
const { sequelize, Event, Session, Attendance, Registration, User } = require('../models');
const logActivity  = require('../utils/logActivity');
const { buildCSV, buildPDF, maskPII } = require('../utils/exportUtils');
const logger = require('../utils/logger');

// simple in-memory cache: key -> { data, expiresAt }
const cache = new Map();
const TTL = 5 * 60 * 1000; // 5-minute TTL

function fromCache(key) {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.data;
  cache.delete(key);
  return null;
}
function toCache(key, data) {
  cache.set(key, { data, expiresAt: Date.now() + TTL });
}

// GET /api/admin/analytics/overview
exports.overview = async (req, res) => {
  const { eventId, startDate, endDate } = req.query;
  const cacheKey = `overview:${eventId}:${startDate}:${endDate}`;
  const cached = fromCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const eventWhere = eventId ? { id: eventId } : {};
    const dateWhere  = {};
    if (startDate) dateWhere[Op.gte] = new Date(startDate);
    if (endDate) dateWhere[Op.lte] = new Date(endDate);

    const [totalEvents, totalSessions] = await Promise.all([
      Event.count({ where: eventWhere }),
      Session.count({ include: eventId ? [{ model: Event, as: 'event', where: { id: eventId } }] : [] }),
    ]);

    // active attendees (distinct users with at least one present/late record)
    const activeAttendeesResult = await sequelize.query(
      `SELECT COUNT(DISTINCT a.user_id) AS count
       FROM attendances a
       JOIN sessions s ON s.id = a.session_id
       JOIN events e ON e.id = s.event_id
       WHERE a.status IN ('Present', 'Late')
         ${eventId ? 'AND e.id = :eventId' : ''}
         ${startDate ? 'AND a.check_in_time >= :startDate' : ''}
         ${endDate ? 'AND a.check_in_time <= :endDate'   : ''}`,
      { type: QueryTypes.SELECT, replacements: { eventId, startDate, endDate } },
    );
    const activeAttendees = parseInt(activeAttendeesResult[0]?.count || 0, 10);

    // participation rate: attended / registered × 100
    const participationResult = await sequelize.query(
      `SELECT
         COUNT(DISTINCT CASE WHEN a.status IN ('Present','Late') THEN r.user_id END) AS attended,
         COUNT(DISTINCT r.user_id)                                                   AS registered
       FROM registrations r
       LEFT JOIN attendances a ON a.user_id = r.user_id AND a.session_id = r.session_id
       JOIN sessions s ON s.id = r.session_id
       JOIN events   e ON e.id = r.event_id
       WHERE 1=1
         ${eventId ? 'AND e.id = :eventId' : ''}`,
      { type: QueryTypes.SELECT, replacements: { eventId } },
    );
    const { attended = 0, registered = 1 } = participationResult[0] || {};
    const participationRate = registered > 0
      ? Math.round((Number(attended) / Number(registered)) * 100)
      : 0;

    // 30-day trend (daily attendance counts)
    const trendRows = await sequelize.query(
      `SELECT DATE(a.check_in_time) AS day, COUNT(*) AS count
       FROM attendances a
       JOIN sessions s ON s.id = a.session_id
       JOIN events e ON e.id = s.event_id
       WHERE a.check_in_time >= NOW() - INTERVAL '30 days'
         ${eventId ? 'AND e.id = :eventId' : ''}
       GROUP BY DATE(a.check_in_time)
       ORDER BY day ASC`,
      { type: QueryTypes.SELECT, replacements: { eventId } },
    );

    const result = {
      totalEvents,
      totalSessions,
      activeAttendees,
      participationRate: `${participationRate}%`,
      trend: trendRows.map(r => ({ day: r.day, count: parseInt(r.count, 10) })),
    };

    toCache(cacheKey, result);
    return res.json(result);

  } catch (err) {
    logger.error('[analyticsController.overview]', err);
    return res.status(500).json({ error: { message: 'Failed to load analytics overview.', code: 'INTERNAL_ERROR' } });
  }
};

// GET /api/admin/analytics/sessions
exports.sessions = async (req, res) => {
  const { eventId } = req.query;
  if (!eventId) {
    return res.status(400).json({ error: { message: 'eventId is required.', code: 'VALIDATION_ERROR' } });
  }

  const cacheKey = `sessions:${eventId}`;
  const cached   = fromCache(cacheKey);
  if (cached) return res.json(cached);

  try {
    const rows = await sequelize.query(
      `SELECT
         s.id,
         COALESCE(s.title, s.name)                                                       AS title,
         s.capacity,
         COUNT(DISTINCT r.user_id)                                                        AS registered_count,
         COUNT(DISTINCT a.user_id) FILTER (WHERE a.status IN ('Present','Late'))          AS attended_count,
         ROUND(
           COUNT(DISTINCT a.user_id) FILTER (WHERE a.status IN ('Present','Late'))::numeric
           / NULLIF(s.capacity, 0) * 100, 1
         )                                                                                AS capacity_pct,
         u.full_name                                                                      AS facilitator_name
       FROM sessions s
       LEFT JOIN registrations r ON r.session_id = s.id
       LEFT JOIN attendances   a ON a.session_id  = s.id
       LEFT JOIN users         u ON u.id = s.facilitator_id
       WHERE s.event_id = :eventId
       GROUP BY s.id, s.title, s.name, s.capacity, u.full_name
       ORDER BY s.id`,
      { type: QueryTypes.SELECT, replacements: { eventId } },
    );

    const result = {
      sessions: rows.map(r => ({
        id:              r.id,
        title:           r.title,
        capacity:        parseInt(r.capacity, 10),
        registeredCount: parseInt(r.registered_count, 10),
        attendedCount:   parseInt(r.attended_count,   10),
        capacityPct:     parseFloat(r.capacity_pct   || 0),
        facilitatorName: r.facilitator_name || null,
      })),
    };

    toCache(cacheKey, result);
    return res.json(result);

  } catch (err) {
    logger.error('[analyticsController.sessions]', err);
    return res.status(500).json({ error: { message: 'Failed to load session analytics.', code: 'INTERNAL_ERROR' } });
  }
};

// GET /api/admin/reports/preview
exports.preview = async (req, res) => {
  const {
    eventId, sessionId, startDate, endDate, q,
    page = 1, pageSize = 20, sort = 'registered_at',
  } = req.query;

  const safeSort = ['registered_at', 'full_name', 'email', 'status', 'check_in_time']
    .includes(sort) ? sort : 'registered_at';

  const limit  = Math.min(50, parseInt(pageSize, 10) || 20);
  const offset = (Math.max(1, parseInt(page, 10)) - 1) * limit;

  const conditions = ['1=1'];
  const replacements = {};

  if (eventId)   { conditions.push('r.event_id = :eventId');     replacements.eventId   = eventId;   }
  if (sessionId) { conditions.push('r.session_id = :sessionId'); replacements.sessionId = sessionId; }
  if (startDate) { conditions.push('r.registered_at >= :startDate'); replacements.startDate = startDate; }
  if (endDate)   { conditions.push('r.registered_at <= :endDate');   replacements.endDate   = endDate;   }
  if (q) {
    conditions.push(`(u.full_name ILIKE :q OR u.email ILIKE :q OR COALESCE(u.student_id,'') ILIKE :q)`);
    replacements.q = `%${q}%`;
  }

  const where = conditions.join(' AND ');

  try {
    const [rows, countRows] = await Promise.all([
      sequelize.query(
        `SELECT
           r.id              AS "registrationId",
           u.full_name       AS "fullName",
           u.email,
           u.student_id      AS "studentId",
           u.department,
           COALESCE(s.title, s.name) AS "sessionTitle",
           r.status          AS "registrationStatus",
           a.status          AS "attendanceStatus",
           a.check_in_time   AS "checkInTime",
           r.registered_at   AS "registeredAt"
         FROM registrations r
         JOIN users    u ON u.id = r.user_id
         LEFT JOIN sessions  s ON s.id = r.session_id
         LEFT JOIN attendances a ON a.user_id = r.user_id AND a.session_id = r.session_id
         WHERE ${where}
         ORDER BY r.${safeSort} DESC
         LIMIT :limit OFFSET :offset`,
        { type: QueryTypes.SELECT, replacements: { ...replacements, limit, offset } },
      ),
      sequelize.query(
        `SELECT COUNT(*) AS total
         FROM registrations r
         JOIN users    u ON u.id = r.user_id
         LEFT JOIN sessions  s ON s.id = r.session_id
         WHERE ${where}`,
        { type: QueryTypes.SELECT, replacements },
      ),
    ]);

    const total = parseInt(countRows[0]?.total || 0, 10);

    // PII masking — centralised via exportUtils.maskPII (Admin/Organizer/Staff tiers)
    const masked = rows.map(r => maskPII(r, req.user.role));

    return res.json({ total, page: parseInt(page, 10), pageSize: limit, rows: masked });

  } catch (err) {
    logger.error('[analyticsController.preview]', err);
    return res.status(500).json({ error: { message: 'Failed to load report preview.', code: 'INTERNAL_ERROR' } });
  }
};

// GET /api/admin/reports/export
exports.exportReport = async (req, res) => {
  const { eventId, sessionId, startDate, endDate, format = 'csv', limit = 1000 } = req.query;

  // clamp to Joi-validated max (passed through from validate middleware)
  const rowLimit = Math.min(parseInt(limit, 10) || 1000, 10000);

  const conditions   = ['1=1'];
  const replacements = {};
  if (eventId)   { conditions.push('r.event_id = :eventId');     replacements.eventId   = eventId; }
  if (sessionId) { conditions.push('r.session_id = :sessionId'); replacements.sessionId = sessionId; }
  if (startDate) { conditions.push('r.registered_at >= :startDate'); replacements.startDate = startDate; }
  if (endDate)   { conditions.push('r.registered_at <= :endDate');   replacements.endDate   = endDate; }
  const where = conditions.join(' AND ');

  try {
    const rows = await sequelize.query(
      `SELECT
         r.id              AS "registrationId",
         u.full_name       AS "fullName",
         u.email,
         u.student_id      AS "studentId",
         u.department,
         COALESCE(s.title, s.name) AS "sessionTitle",
         r.status          AS "registrationStatus",
         a.status          AS "attendanceStatus",
         TO_CHAR(a.check_in_time, 'YYYY-MM-DD HH24:MI') AS "checkInTime",
         TO_CHAR(r.registered_at,  'YYYY-MM-DD HH24:MI') AS "registeredAt"
       FROM registrations r
       JOIN users    u ON u.id = r.user_id
       LEFT JOIN sessions  s ON s.id = r.session_id
       LEFT JOIN attendances a ON a.user_id = r.user_id AND a.session_id = r.session_id
       WHERE ${where}
       ORDER BY r.registered_at DESC
       LIMIT :rowLimit`,
      { type: QueryTypes.SELECT, replacements: { ...replacements, rowLimit } },
    );

    // fetch event title for PDF metadata
    let eventTitle = null;
    if (eventId) {
      const ev = await Event.findByPk(eventId, { attributes: ['title'] });
      eventTitle = ev?.title || null;
    }

    const ts       = new Date().toISOString().slice(0, 10);
    const role     = req.user.role;
    const metadata = {
      eventTitle,
      dateRange: startDate && endDate ? `${startDate} to ${endDate}` : null,
    };

    if (format === 'pdf') {
      const buf = buildPDF(rows, role, metadata);
      res.setHeader('Content-Disposition', `attachment; filename="ems-report-${eventId || 'all'}-${ts}.pdf"`);
      res.setHeader('Content-Type', 'application/pdf');
      await logActivity(req.user.id, 'REPORT_EXPORTED', 'Report', null,
        `Exported PDF (${rows.length} rows, event ${eventId || 'all'})`,
        { format: 'pdf', recordCount: rows.length, role });
      return res.send(buf);
    }

    // default: CSV
    const csv = buildCSV(rows, role);
    res.setHeader('Content-Disposition', `attachment; filename="ems-report-${eventId || 'all'}-${ts}.csv"`);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    await logActivity(req.user.id, 'REPORT_EXPORTED', 'Report', null,
      `Exported CSV (${rows.length} rows, event ${eventId || 'all'})`,
      { format: 'csv', recordCount: rows.length, role });
    return res.send(csv);

  } catch (err) {
    logger.error('[analyticsController.exportReport]', err);
    return res.status(500).json({ error: { message: 'Export failed.', code: 'INTERNAL_ERROR' } });
  }
};

