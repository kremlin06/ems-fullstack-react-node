'use strict';

// Generic notification routes — Phase 6 (Staff area restructure).
//
// Mounted at /api/notifications.  Requires a valid JWT but accepts ANY role;
// the controller scopes every query to req.user.id so callers only ever see
// their own notifications.  Used by Staff / Organizer / Admin notification
// pages as well as any future role.

const router          = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const c               = require('../controllers/notificationController');

router.use(verifyToken);

router.get('/',                c.getMyNotifications);
router.patch('/read-all',      c.markAllRead);

module.exports = router;
