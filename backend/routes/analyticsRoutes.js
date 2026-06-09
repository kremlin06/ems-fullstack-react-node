'use strict';

const router = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const c      = require('../controllers/analyticsController');

// analytics endpoints: Admin + Organizer
router.use(verifyToken);
router.use(requireRole('Admin', 'Organizer'));

// dashboard aggregations
router.get('/analytics/overview',  c.overview);
router.get('/analytics/sessions',  c.sessions);

// paginated preview (used by ReportTable)
router.get('/reports/preview',     c.preview);

// binary export — Staff/Attendee blocked by requireRole above
router.get('/reports/export',      c.exportReport);

module.exports = router;
