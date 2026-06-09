'use strict';

const router   = require('express').Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const upload   = require('../middleware/upload');
const validate = require('../middleware/validate');
const c        = require('../controllers/attendeeController');

// all attendee routes require valid JWT + Admin or Organizer role
router.use(verifyToken);
router.use(requireRole('Admin', 'Organizer'));

// bulk upload — multer first (parses multipart), then controller
router.post('/attendees/upload',             upload,                      c.upload);

// manual single-attendee creation
router.post('/attendees/manual',             validate('attendeeManual'),  c.createManual);

// paginated attendee list for an event
router.get('/attendees/:eventId',                                         c.list);

// bulk session assignment
router.post('/registrations/assign',         validate('assignSessions'),  c.assignSessions);

module.exports = router;
