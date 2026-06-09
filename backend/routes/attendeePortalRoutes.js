'use strict';

// Attendee-facing portal routes — Phase 5
//
// Mounted at /api so the public path is `/api/events/open`, `/api/attendee/*`.
// All routes require a valid JWT but accept any role; the controller scopes
// queries to req.user.id, so users can only see their own data.

const router       = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const c            = require('../controllers/attendeeController');

router.use(verifyToken);

// Events open for registration
router.get('/events/open',                       c.getOpenEvents);

// Self-registration
router.post('/attendee/register',                c.register);

// Portal data
router.get('/attendee/schedule',                 c.getSchedule);
router.get('/attendee/attendance',               c.getAttendanceHistory);
router.get('/attendee/notifications',             c.getNotifications);
router.patch('/attendee/notifications/read-all',  c.markAllNotificationsRead);
// added: mark a single notification as read — called when the user clicks one row
router.patch('/attendee/notifications/:id/read',  c.markOneNotificationRead);

module.exports = router;
