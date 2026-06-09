'use strict';

const router   = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const c        = require('../controllers/attendanceController');

// All attendance routes require a valid JWT
router.use(verifyToken);

// Attendee-only: generate a signed QR payload for an event
router.get('/qr-code/:eventId', requireRole('Attendee'), c.getQRCode);

// Staff/Admin/Organizer routes
router.use(requireRole('Admin', 'Organizer', 'Staff'));

router.post('/scan',                   validate('scanPayload'),    c.scan);
router.get('/session/:id/stats',                                   c.getSessionStats);
router.get('/session/:id/stream',                                  c.stream);
router.get('/session/:id',                                         c.list);
router.put('/:id',                     validate('manualOverride'), c.update);

module.exports = router;
