'use strict';

const logger = require('../utils/logger');

const { Event, Session, Registration, Attendance, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const logActivity = require('../utils/logActivity');

// helper: check if a table exists — used to return graceful errors before migrations run
const tableExists = async (tableName) => {
  try {
    await sequelize.query(`SELECT 1 FROM "${tableName}" LIMIT 1`);
    return true;
  } catch {
    return false;
  }
};

/**
 * GET /api/admin/stats
 * returns 4 metric card values: totalEvents, activeAttendees, participationRate, totalSessions
 */
exports.getStats = async (req, res) => {
  try {
    const [eventsExist, sessionsExist, attendancesExist, registrationsExist] = await Promise.all([
      tableExists('events'),
      tableExists('sessions'),
      tableExists('attendances'),
      tableExists('registrations'),
    ]);

    if (!eventsExist) {
      return res.status(503).json({
        error: { message: 'Database tables not yet migrated. Run: npx sequelize-cli db:migrate', code: 'TABLES_MISSING' },
      });
    }

    const [totalEvents, totalSessions] = await Promise.all([
      Event.count(),
      sessionsExist ? Session.count() : Promise.resolve(0),
    ]);

    // active attendees = distinct users who checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeAttendees = attendancesExist
      ? await Attendance.count({
          distinct: true,
          col: 'user_id',
          where: { status: 'Present', checkInTime: { [Op.gte]: today } },
        })
      : 0;

    // participation rate = confirmed registrations / total registrations
    let participationRate = '0%';
    if (registrationsExist) {
      const [total, confirmed] = await Promise.all([
        Registration.count(),
        Registration.count({ where: { status: 'Confirmed' } }),
      ]);
      participationRate = total > 0 ? `${Math.round((confirmed / total) * 100)}%` : '0%';
    }

    return res.json({
      totalEvents,
      totalSessions,
      activeAttendees,
      participationRate,
      // keep legacy fields so existing consumers still work
      upcomingEvents: await Event.count({ where: { status: 'Upcoming' } }),
    });
  } catch (err) {
    logger.error('[admin] getStats error:', err);
    return res.status(500).json({ error: { message: 'Failed to load stats' } });
  }
};

/**
 * GET /api/admin/attendance/sessions
 * returns per-session attendance counts for the bar chart (US-18)
 * uses idx_attendance_sessionid for NFR-01 performance
 */
exports.getSessionAttendance = async (req, res) => {
  try {
    if (!(await tableExists('sessions'))) {
      return res.status(503).json({ error: { message: 'Tables not migrated', code: 'TABLES_MISSING' } });
    }

    const sessions = await Session.findAll({
      attributes: [
        'id',
        // title is the canonical field after migration 000006;
        // fall back to name for any rows that pre-date the migration
        [sequelize.literal(`COALESCE("Session"."title", "Session"."name")`), 'displayTitle'],
        'capacity',
        [sequelize.literal(`(
          SELECT COUNT(*) FROM attendances
          WHERE attendances.session_id = "Session".id
          AND attendances.status IN ('Present', 'Late')
        )`), 'attended'],
      ],
      include: [{ model: Event, as: 'event', attributes: ['id', 'title', 'date'] }],
      // schedule is the canonical field after migration 000006; fall back to start_time
      order: [[sequelize.literal(`COALESCE("Session"."schedule", "Session"."start_time")`), 'ASC']],
    });

    const data = sessions.map((s) => ({
      sessionId:   s.id.toString(),
      sessionName: s.dataValues.displayTitle || 'Unnamed Session',
      eventName:   s.event?.title || 'Unknown Event',
      attended:    parseInt(s.dataValues.attended, 10) || 0,
      capacity:    s.capacity,
      date:        s.event?.date || null,
    }));

    return res.json(data);
  } catch (err) {
    logger.error('[admin] getSessionAttendance error:', err);
    return res.status(500).json({ error: { message: 'Failed to load session attendance' } });
  }
};

/**
 * GET /api/admin/activity?page=1&pageSize=10
 * paginated activity log: union of D4 (attendances) + D3 (registrations)
 * uses idx_attendance_sessionid + idx_attendance_status (NFR-01)
 */
exports.getActivityLog = async (req, res) => {
  try {
    if (!(await tableExists('registrations'))) {
      return res.status(503).json({ error: { message: 'Tables not migrated', code: 'TABLES_MISSING' } });
    }

    const page     = Math.max(1, parseInt(req.query.page, 10)     || 1);
    const pageSize = Math.min(50, parseInt(req.query.pageSize, 10) || 10);
    const offset   = (page - 1) * pageSize;

    // fetch registrations (D3)
    const [regRows, attRows] = await Promise.all([
      Registration.findAll({
        include: [
          { model: User,  as: 'user',  attributes: ['id', 'fullName', 'email', 'studentId'] },
          { model: Event, as: 'event', attributes: ['id', 'title'] },
        ],
        order: [['registeredAt', 'DESC']],
      }),
      Attendance.findAll({
        include: [
          { model: User,    as: 'user',    attributes: ['id', 'fullName', 'email', 'studentId'] },
          { model: Session, as: 'session', attributes: ['id', 'title', 'name'],
            include: [{ model: Event, as: 'event', attributes: ['id', 'title'] }] },
        ],
        order: [['checkInTime', 'DESC']],
      }),
    ]);

    // normalise to unified activity shape
    const activities = [
      ...regRows.map((r) => ({
        id:          `REG-${r.id}`,
        source:      'registration',
        studentId:   r.user?.studentId || '—',
        studentName: r.user?.fullName  || 'Unknown',
        email:       r.user?.email     || '—',
        event:       r.event?.title    || '—',
        session:     null,
        action:      r.status === 'Cancelled' ? 'Cancelled' : 'Registered',
        status:      r.status,
        timestamp:   r.registeredAt,
      })),
      ...attRows.map((a) => ({
        id:          `ATT-${a.id}`,
        source:      'attendance',
        studentId:   a.user?.studentId                           || '—',
        studentName: a.user?.fullName                            || 'Unknown',
        email:       a.user?.email                               || '—',
        event:       a.session?.event?.title                     || '—',
        // title is canonical after migration 000006; fall back to name for old rows
        session:     a.session?.title || a.session?.name         || '—',
        action:      'Check-in',
        status:      a.status,
        timestamp:   a.checkInTime,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const total      = activities.length;
    const items      = activities.slice(offset, offset + pageSize);
    const totalPages = Math.ceil(total / pageSize);

    return res.json({ items, total, page, pageSize, totalPages });
  } catch (err) {
    logger.error('[admin] getActivityLog error:', err);
    return res.status(500).json({ error: { message: 'Failed to load activity log' } });
  }
};

/**
 * GET /api/admin/events
 */
exports.getEvents = async (req, res) => {
  try {
    if (!(await tableExists('events'))) {
      return res.status(503).json({ error: { message: 'Tables not migrated', code: 'TABLES_MISSING' } });
    }

    const { status, page = 1, pageSize = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const { rows: events, count } = await Event.findAndCountAll({
      where,
      order: [['date', 'DESC']],
      limit:  parseInt(pageSize, 10),
      offset: (parseInt(page, 10) - 1) * parseInt(pageSize, 10),
    });

    return res.json({ events, total: count, page: parseInt(page, 10), pageSize: parseInt(pageSize, 10) });
  } catch (err) {
    logger.error('[admin] getEvents error:', err);
    return res.status(500).json({ error: { message: 'Failed to load events' } });
  }
};

/**
 * POST /api/admin/events
 * body: { title, description, date, venue, status, capacity, imageUrl }
 */
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, status, capacity, imageUrl } = req.body;

    const event = await Event.create({
      title:       title.trim(),
      description: description?.trim() || null,
      date,
      venue:       venue?.trim() || null,
      status:      status || 'Upcoming',
      capacity:    capacity || 100,
      imageUrl:    imageUrl || null,
      createdBy:   req.user.id,
    });

    // fire-and-forget audit log
    logActivity(req.user.id, 'EVENT_CREATED', 'event', event.id,
      `Event "${event.title}" created`, { status: event.status, venue: event.venue });

    return res.status(201).json({ event });
  } catch (err) {
    logger.error('[admin] createEvent error:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: { message: err.errors[0]?.message || 'Validation failed', code: 'VALIDATION_ERROR' } });
    }
    return res.status(500).json({ error: { message: 'Failed to create event' } });
  }
};

/**
 * PUT /api/admin/events/:id
 */
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: { message: 'Event not found', code: 'NOT_FOUND' } });

    const { title, description, date, venue, status, capacity, imageUrl } = req.body;
    await event.update({ title, description, date, venue, status, capacity, imageUrl });

    logActivity(req.user.id, 'EVENT_UPDATED', 'event', event.id,
      `Event "${event.title}" updated`, { status: event.status });

    return res.json({ event });
  } catch (err) {
    logger.error('[admin] updateEvent error:', err);
    return res.status(500).json({ error: { message: 'Failed to update event' } });
  }
};

/**
 * DELETE /api/admin/events/:id
 */
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: { message: 'Event not found', code: 'NOT_FOUND' } });

    const title = event.title;
    await event.destroy();

    logActivity(req.user.id, 'EVENT_DELETED', 'event', parseInt(req.params.id, 10),
      `Event "${title}" deleted`, {});

    return res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    logger.error('[admin] deleteEvent error:', err);
    return res.status(500).json({ error: { message: 'Failed to delete event' } });
  }
};

/**
 * GET /api/admin/staff
 * Returns staff and organizer users for the FacilitatorDropdown.
 * Restricted to Admin/Organizer by the route-level requireRole middleware.
 */
exports.getStaff = async (req, res) => {
  try {
    const staff = await User.findAll({
      where: { role: { [Op.in]: ['Staff', 'Organizer', 'Admin'] } },
      attributes: ['id', 'fullName', 'email', 'role'],
      order: [['fullName', 'ASC']],
    });
    return res.json({ staff });
  } catch (err) {
    logger.error('[admin] getStaff error:', err);
    return res.status(500).json({ error: { message: 'Failed to load staff list' } });
  }
};

/**
 * POST /api/admin/sessions
 * body: { eventId, title, schedule, capacity, facilitatorId }
 * Creates a session under a parent event.
 */
exports.createSession = async (req, res) => {
  try {
    const { eventId, title, schedule, capacity, facilitatorId } = req.body;

    if (!eventId || !title) {
      return res.status(400).json({ error: { message: 'eventId and title are required', code: 'VALIDATION_ERROR' } });
    }

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: { message: 'Parent event not found', code: 'NOT_FOUND' } });
    }

    const session = await Session.create({
      eventId:      parseInt(eventId, 10),
      title:        title.trim(),
      schedule:     schedule || null,
      capacity:     parseInt(capacity, 10) || 50,
      facilitatorId: facilitatorId || null,
    });

    logActivity(req.user.id, 'SESSION_CREATED', 'session', session.id,
      `Session "${session.title}" created under event "${event.title}"`,
      { eventId: event.id, facilitatorId: session.facilitatorId });

    return res.status(201).json({ session });
  } catch (err) {
    logger.error('[admin] createSession error:', err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: { message: err.errors[0]?.message || 'Validation failed', code: 'VALIDATION_ERROR' } });
    }
    return res.status(500).json({ error: { message: 'Failed to create session' } });
  }
};

/**
 * GET /api/admin/sessions?eventId=&page=1&pageSize=20
 * Lists sessions, optionally filtered by event.
 */
exports.getSessions = async (req, res) => {
  try {
    if (!(await tableExists('sessions'))) {
      return res.status(503).json({ error: { message: 'Tables not migrated', code: 'TABLES_MISSING' } });
    }

    const { eventId, page = 1, pageSize = 20 } = req.query;
    const where = {};
    if (eventId) where.eventId = parseInt(eventId, 10);

    const { rows: sessions, count } = await Session.findAndCountAll({
      where,
      include: [
        { model: Event, as: 'event', attributes: ['id', 'title'] },
        { model: User,  as: 'facilitator', attributes: ['id', 'fullName', 'email'] },
      ],
      order: [[sequelize.literal(`COALESCE("Session"."schedule", "Session"."start_time")`), 'ASC']],
      limit:  parseInt(pageSize, 10),
      offset: (parseInt(page, 10) - 1) * parseInt(pageSize, 10),
    });

    return res.json({ sessions, total: count, page: parseInt(page, 10), pageSize: parseInt(pageSize, 10) });
  } catch (err) {
    logger.error('[admin] getSessions error:', err);
    return res.status(500).json({ error: { message: 'Failed to load sessions' } });
  }
};

