'use strict';

const logger = require('../utils/logger');

const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');
const { Op }  = require('sequelize');

const { User, Registration, Session, SessionAssignment, Event, Notification, sequelize } = require('../models');
const logActivity = require('../utils/logActivity');
const { parseAndInsert } = require('../utils/parseAttendees');

// POST /api/admin/attendees/upload 
// multer has already parsed the file into req.file (memory storage)
// eventId comes from the multipart form body field
exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'No file uploaded.', code: 'NO_FILE' } });
    }

    const eventId = parseInt(req.body.eventId, 10);
    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({ error: { message: 'eventId is required.', code: 'VALIDATION_ERROR' } });
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: { message: 'Event not found.', code: 'NOT_FOUND' } });
    }

    const result = await parseAndInsert(
      req.file.buffer,
      req.file.mimetype,
      eventId,
      req.user.id,
    );

    const status = result.aborted ? 422 : 200;
    return res.status(status).json(result);

  } catch (err) {
    logger.error('[attendeeController.upload]', err);
    const status = err.status || 500;
    return res.status(status).json({
      error: { message: err.message || 'Upload failed.', code: 'UPLOAD_ERROR' },
    });
  }
};

// POST /api/admin/attendees/manual
exports.createManual = async (req, res) => {
  const { fullName, email, studentId, department, eventId, sessionId } = req.body;

  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: { message: 'Event not found.', code: 'NOT_FOUND' } });
    }

    if (sessionId) {
      const session = await Session.findOne({ where: { id: sessionId, eventId } });
      if (!session) {
        return res.status(404).json({ error: { message: 'Session not found for this event.', code: 'NOT_FOUND' } });
      }
    }

    // find or create user
    let user = await User.findOne({
      where: { [Op.or]: [{ email }, ...(studentId ? [{ studentId }] : [])] },
    });

    if (!user) {
      // create stub user — they cannot log in until they self-register and update their password
      const stubHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 4);
      user = await User.create({
        fullName, email, studentId: studentId || null,
        department: department || null,
        passwordHash: stubHash,
        role: 'Attendee',
        isStub: true,
      });
    }

    // check duplicate registration
    const existing = await Registration.findOne({ where: { userId: user.id, eventId } });
    if (existing) {
      return res.status(409).json({
        error: { message: 'Attendee is already registered for this event.', code: 'DUPLICATE_REGISTRATION' },
      });
    }

    const registration = await Registration.create({
      userId: user.id, eventId, sessionId: sessionId || null, status: 'Confirmed',
    });

    if (sessionId) {
      await SessionAssignment.findOrCreate({
        where: { attendeeId: user.id, sessionId },
        defaults: { attendeeId: user.id, sessionId },
      });
    }

    await logActivity(
      req.user.id,
      'ATTENDEE_ADDED_MANUAL',
      'Attendee',
      user.id,
      `Manually added ${user.email} to event ${eventId}`,
      { eventId, sessionId: sessionId || null },
    );

    return res.status(201).json({
      message:      'Attendee registered successfully.',
      user:         { id: user.id, fullName: user.fullName, email: user.email, isStub: user.isStub },
      registration: { id: registration.id, status: registration.status },
    });

  } catch (err) {
    logger.error('[attendeeController.createManual]', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: { message: 'Email or Student ID already in use.', code: 'DUPLICATE_USER' },
      });
    }
    return res.status(500).json({ error: { message: 'Failed to add attendee.', code: 'INTERNAL_ERROR' } });
  }
};

// GET /api/admin/attendees/:eventId 
exports.list = async (req, res) => {
  try {
    const eventId    = parseInt(req.params.eventId, 10);
    const page       = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize   = Math.min(100, parseInt(req.query.pageSize, 10) || 20);
    const { status, session, q } = req.query;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: { message: 'Event not found.', code: 'NOT_FOUND' } });
    }

    const where = { eventId };
    if (status) where.status = status;
    if (session) where.sessionId = parseInt(session, 10);

    const userWhere = {};
    if (q) {
      // search across name, email, studentId — PII not masked in admin-only endpoint
      userWhere[Op.or] = [
        { fullName: { [Op.iLike]: `%${q}%` } },
        { email:    { [Op.iLike]: `%${q}%` } },
        ...(q.length >= 3 ? [{ studentId: { [Op.iLike]: `%${q}%` } }] : []),
      ];
    }

    const { count, rows } = await Registration.findAndCountAll({
      where,
      include: [
        {
          model:      User,
          as:         'attendee',
          where:      Object.keys(userWhere).length ? userWhere : undefined,
          attributes: ['id', 'fullName', 'email', 'studentId', 'department', 'role', 'isStub'],
        },
        {
          model:      Session,
          as:         'session',
          required:   false,
          attributes: ['id', 'title', 'schedule'],
        },
      ],
      limit:  pageSize,
      offset: (page - 1) * pageSize,
      order:  [['registeredAt', 'DESC']],
    });

    return res.json({
      total:    count,
      page,
      pageSize,
      attendees: rows.map(r => ({
        registrationId: r.id,
        status:         r.status,
        registeredAt:   r.registeredAt,
        session:        r.session ? { id: r.session.id, title: r.session.title } : null,
        attendee: {
          id:         r.attendee.id,
          fullName:   r.attendee.fullName,
          // mask PII for non-admin roles
          email:      req.user.role === 'Admin'
            ? r.attendee.email
            : r.attendee.email.replace(/(.{2}).+(@.+)/, '$1***$2'),
          studentId:  req.user.role === 'Admin' ? r.attendee.studentId : null,
          department: r.attendee.department,
          isStub:     r.attendee.isStub,
        },
      })),
    });

  } catch (err) {
    logger.error('[attendeeController.list]', err);
    return res.status(500).json({ error: { message: 'Failed to fetch attendees.', code: 'INTERNAL_ERROR' } });
  }
};

// POST /api/admin/registrations/assign
exports.assignSessions = async (req, res) => {
  const { attendeeIds, sessionIds } = req.body;

  try {
    // verify all sessions belong to valid events and exist
    const sessions = await Session.findAll({ where: { id: { [Op.in]: sessionIds } } });
    if (sessions.length !== sessionIds.length) {
      return res.status(404).json({ error: { message: 'One or more sessions not found.', code: 'NOT_FOUND' } });
    }

    // verify all attendee IDs are valid users with Attendee role
    const users = await User.findAll({
      where: { id: { [Op.in]: attendeeIds }, role: 'Attendee' },
      attributes: ['id'],
    });
    if (users.length !== attendeeIds.length) {
      return res.status(404).json({ error: { message: 'One or more attendees not found.', code: 'NOT_FOUND' } });
    }

    // build assignment matrix
    const assignRows = [];
    for (const attendeeId of attendeeIds) {
      for (const sessionId of sessionIds) {
        assignRows.push({ attendeeId, sessionId });
      }
    }

    const CHUNK = 500;
    let inserted = 0;
    for (let i = 0; i < assignRows.length; i += CHUNK) {
      const result = await SessionAssignment.bulkCreate(assignRows.slice(i, i + CHUNK), {
        ignoreDuplicates: true,
        returning:        false,
      });
      inserted += result.length;
    }

    await logActivity(
      req.user.id,
      'SESSIONS_BULK_ASSIGNED',
      'SessionAssignment',
      null,
      `Assigned ${attendeeIds.length} attendees to ${sessionIds.length} sessions`,
      { attendeeIds, sessionIds, insertedCount: inserted },
    );

    return res.json({
      message:  `${inserted} assignment(s) created.`,
      inserted,
    });

  } catch (err) {
    logger.error('[attendeeController.assignSessions]', err);
    return res.status(500).json({ error: { message: 'Assignment failed.', code: 'INTERNAL_ERROR' } });
  }
};

// ATTENDEE-FACING ENDPOINTS — Phase 5

// Backs the Attendee Portal pages (BrowseEvents, Schedule, AttendanceHistory,
// MyQRCode, Notifications).  All require a valid JWT but no specific role —
// any logged-in user may query their own portal data; admins testing the
// portal also use these endpoints.  No mock fallbacks anywhere.

// GET /api/events/open
// List events open for registration (status Upcoming/Ongoing).
// Returns enough fields for the BrowseEvents card UI plus isRegistered for
// the current user so the "Join Event" button can disable itself.
exports.getOpenEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const events = await Event.findAll({
      where: { status: { [Op.in]: ['Upcoming', 'Ongoing'] } },
      order: [['date', 'ASC']],
      attributes: ['id', 'title', 'description', 'date', 'venue', 'capacity', 'status'],
      include: [{
        model: Registration,
        as: 'registrations',
        attributes: ['userId', 'status'],
        required: false,
      }],
    });

    const data = events.map((e) => {
      const regs           = e.registrations || [];
      const activeRegs     = regs.filter((r) => r.status !== 'Cancelled');
      const registeredCount = new Set(activeRegs.map((r) => r.userId)).size;
      const isRegistered    = activeRegs.some((r) => r.userId === userId);
      return {
        eventId:         e.id,
        title:           e.title,
        description:     e.description,
        date:            e.date,
        venue:           e.venue,
        capacity:        e.capacity,
        registeredCount,
        status:          e.status,
        isRegistered,
      };
    });

    return res.json(data);
  } catch (err) {
    logger.error('[attendeeController.getOpenEvents]', err);
    return res.status(500).json({ error: { message: 'Failed to load events.', code: 'INTERNAL_ERROR' } });
  }
};

// POST /api/attendee/register 
// body: { eventId }
// Creates one Registration per user/event.  Re-registering after a Cancelled
// row reactivates that row instead of inserting a duplicate.
exports.register = async (req, res) => {
  try {
    const userId  = req.user.id;
    const eventId = parseInt(req.body.eventId, 10);
    if (!Number.isFinite(eventId)) {
      return res.status(400).json({ error: { message: 'Valid eventId is required.', code: 'VALIDATION_ERROR' } });
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: { message: 'Event not found.', code: 'NOT_FOUND' } });
    }
    if (!['Upcoming', 'Ongoing'].includes(event.status)) {
      return res.status(422).json({ error: { message: 'Event is not open for registration.', code: 'EVENT_CLOSED' } });
    }

    // capacity check — count active registrations
    const activeCount = await Registration.count({
      where: { eventId, status: { [Op.ne]: 'Cancelled' } },
    });
    if (event.capacity && activeCount >= event.capacity) {
      return res.status(409).json({ error: { message: 'Event is at capacity.', code: 'EVENT_FULL' } });
    }

    // reactivate cancelled row if one exists; otherwise create new
    const existing = await Registration.findOne({ where: { userId, eventId } });
    let registration;
    if (existing) {
      if (existing.status !== 'Cancelled') {
        return res.status(409).json({ error: { message: 'Already registered.', code: 'ALREADY_REGISTERED' } });
      }
      existing.status = 'Confirmed';
      await existing.save();
      registration = existing;
    } else {
      registration = await Registration.create({ userId, eventId, status: 'Confirmed' });
    }

    logActivity(userId, 'EVENT_REGISTERED', 'Registration', registration.id,
      `Registered for "${event.title}"`, { eventId });

    // create a real Notification row for this registration so the attendee
    // sees a persisted, read-state-aware notification on their Notifications page.
    // old: notifications were "derived" from the Registration table on every
    //      getNotifications() call with read: false hardcoded — meaning they
    //      always appeared unread even after the user marked them as read.
    // now: a Notification row is written here so isRead can be properly toggled
    //      in the database and survives page reloads.
    // we use try/catch so a notification write failure never blocks the
    // registration response — the user is still registered even if this fails.
    try {
      await Notification.create({
        userId,
        type:    'success',
        title:   'Registration Confirmed',
        message: `You have been registered for "${event.title}".`,
        isRead:  false,
      });
    } catch (notifErr) {
      // non-fatal — log it but don't fail the registration
      logger.warn('[attendeeController.register] notification write failed:', notifErr.message);
    }

    return res.status(201).json({
      id:      registration.id,
      eventId: registration.eventId,
      status:  registration.status,
    });
  } catch (err) {
    logger.error('[attendeeController.register]', err);
    return res.status(500).json({ error: { message: 'Registration failed.', code: 'INTERNAL_ERROR' } });
  }
};

//  GET /api/attendee/schedule 
// Sessions the current user is scheduled for, via SessionAssignment join.
// Falls back to all sessions under registered events when no assignments exist
// — so a user who registers for an event but isn't assigned to a specific
// session still sees it on their schedule.
exports.getSchedule = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1) explicitly-assigned sessions
    // old: where: { userId } — wrong column name.  the table column is
    //      attendee_id, mapped on the model as attendeeId, NOT userId.
    //      sequelize silently returned zero rows so this primary query
    //      never matched anything, and we always fell through to the
    //      "all sessions under registered events" fallback below.
    //      that's why angelo saw "opening ceremony" (an event-wide
    //      session) in his schedule instead of "let's meet each other!"
    //      (the session he was actually assigned to).
    // new: query the right column so explicit assignments take priority.
    const assignments = await SessionAssignment.findAll({
      where: { attendeeId: userId },
      include: [{
        model:   Session,
        as:      'session',
        include: [{ model: Event, as: 'event', attributes: ['id', 'title', 'date'] }],
      }],
    });

    let sessions = assignments
      .map((a) => a.session)
      .filter(Boolean);

    // 2) if user has no explicit assignments, fall back to sessions under
    //    events they registered for
    if (sessions.length === 0) {
      const regs = await Registration.findAll({
        where:  { userId, status: { [Op.ne]: 'Cancelled' } },
        attributes: ['eventId'],
      });
      const eventIds = regs.map((r) => r.eventId);
      if (eventIds.length > 0) {
        sessions = await Session.findAll({
          where: { eventId: { [Op.in]: eventIds } },
          include: [{ model: Event, as: 'event', attributes: ['id', 'title', 'date'] }],
        });
      }
    }

    const data = sessions
      .map((s) => ({
        sessionId:   s.id,
        title:       s.title || s.name || 'Untitled session',
        eventTitle:  s.event?.title || 'Unknown event',
        schedule:    s.schedule || null,
        venue:       s.venue || s.event?.venue || null,
        status:      'Upcoming',
      }))
      // newest first, putting nulls at the end
      .sort((a, b) => {
        if (!a.schedule) return 1;
        if (!b.schedule) return -1;
        return new Date(a.schedule) - new Date(b.schedule);
      });

    return res.json(data);
  } catch (err) {
    logger.error('[attendeeController.getSchedule]', err);
    return res.status(500).json({ error: { message: 'Failed to load schedule.', code: 'INTERNAL_ERROR' } });
  }
};

//  GET /api/attendee/attendance 
// Real attendance history — only check-ins that actually happened.
exports.getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const { Attendance } = require('../models');
    const records = await Attendance.findAll({
      where: { userId },
      include: [{
        model: Session,
        as:    'session',
        attributes: ['id', 'title', 'name'],
        include: [{ model: Event, as: 'event', attributes: ['id', 'title'] }],
      }],
      order: [['checkInTime', 'DESC']],
    });

    const data = records.map((a) => ({
      id:            a.id,
      eventTitle:    a.session?.event?.title       || '—',
      sessionTitle:  a.session?.title || a.session?.name || '—',
      checkInTime:   a.checkInTime,
      checkOutTime:  null,                          // not yet tracked
      status:        a.status,
    }));

    return res.json(data);
  } catch (err) {
    logger.error('[attendeeController.getAttendanceHistory]', err);
    return res.status(500).json({ error: { message: 'Failed to load attendance history.', code: 'INTERNAL_ERROR' } });
  }
};

//  GET /api/attendee/notifications 
// Phase 6: merges three sources so the attendee sees a complete picture:
//   1. Notification table — persisted check-in alerts written by scan (FR-08)
//      these carry a real `read` boolean that survives page reloads.
//   2. Registrations (derived) — "You registered for Event X" confirmations
//   3. SessionAssignments (derived) — "You were assigned to Session Y" alerts
//
// old (Phase 5): also derived from Attendance rows, but those are now handled
// by source 1 (Notification table), so we drop the attendance derivation to
// avoid showing the same check-in twice.
// old: merged three sources — Notification table (N-), derived registrations (REG-),
//      derived session assignments (ASG-). sources 2 and 3 had read: false hardcoded
//      on every fetch, so they always appeared unread even after "Mark all as read".
// new: reads only from the Notification table. registration notifications are now
//      written as real Notification rows when the user registers (see register() above).
//      this means isRead is persisted in the database and survives page reloads.
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifRows = await Notification.findAll({
      where:  { userId },
      order:  [['createdAt', 'DESC']],
      limit:  50,
    });

    const notifications = notifRows.map((n) => ({
      id:        n.id,          // numeric id — no more N-/REG-/ASG- prefix needed
      type:      n.type,
      title:     n.title,
      message:   n.message,
      createdAt: n.createdAt,
      read:      n.isRead,
    }));

    return res.json(notifications);
  } catch (err) {
    logger.error('[attendeeController.getNotifications]', err);
    return res.status(500).json({ error: { message: 'Failed to load notifications.', code: 'INTERNAL_ERROR' } });
  }
};

//  PATCH /api/attendee/notifications/read-all
exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );
    return res.json({ ok: true });
  } catch (err) {
    logger.error('[attendeeController.markAllNotificationsRead]', err);
    return res.json({ ok: false });
  }
};

//  PATCH /api/attendee/notifications/:id/read 
// added: marks a single notification as read by its database id.
// the frontend can call this when the user clicks on a notification row,
// giving them per-notification read state instead of only "mark all as read".
exports.markOneNotificationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifId = Number(req.params.id);

    // only update if it belongs to the requesting user — security check.
    // without this, any authenticated user could mark any notification as read.
    const [updated] = await Notification.update(
      { isRead: true },
      { where: { id: notifId, userId, isRead: false } }
    );

    // updated is the count of rows changed (0 = not found / already read / wrong user)
    return res.json({ ok: true, updated });
  } catch (err) {
    logger.error('[attendeeController.markOneNotificationRead]', err);
    return res.json({ ok: false });
  }
};


