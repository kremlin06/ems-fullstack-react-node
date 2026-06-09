'use strict';

// express Router creates a mini-app that handles routes and middleware.
// we attach it to the main app in server.js under the /api prefix.
const router      = require('express').Router();

// verifyToken reads the Bearer JWT from the Authorization header and attaches
// { id, role } to req.user. if the token is missing or expired it returns 401.
// requireRole(...roles) checks that req.user.role is in the allowed list. if
// not, it returns 403 Forbidden. these two always go together on protected routes.
const { verifyToken, requireRole } = require('../middleware/auth');

// validate is a middleware factory. validate('createUser') returns a middleware
// that runs the Joi schema named 'createUser' against req.body before the
// controller function runs. bad data never reaches the controller.
const validate    = require('../middleware/validate');

const admin       = require('../controllers/adminController');

// this is the new controller we made for creating and listing users
const userMgmt    = require('../controllers/userManagementController');

// every route below requires a valid jwt — no exceptions.
router.use(verifyToken);

// read-only endpoints accessible to Admin, Organizer, AND Staff
// these must be declared before the global requireRole('Admin', 'Organizer')
// gate below, because express processes routes in declaration order.  a
// matched route handler short-circuits any later router.use() middleware.
//
// why staff needs these two:
//   - GET /events  → populates the "Select an event…" dropdown in the staff
//                    qr-scanner dashboard.  without it the dropdown is always
//                    empty and staff cannot scan any session.
//   - GET /sessions → populates the "Select a session…" dropdown after the
//                    staff user picks an event.
//
// old: only Admin + Organizer were in the global gate, so Staff got 403 and
//      the StaffDashboardLayout fetch silently failed — empty dropdown.
router.get('/events',    requireRole('Admin', 'Organizer', 'Staff'), admin.getEvents);
router.get('/sessions',  requireRole('Admin', 'Organizer', 'Staff'), admin.getSessions);

// all remaining routes require Admin or Organizer
router.use(requireRole('Admin', 'Organizer'));

// dashboard metrics
router.get('/stats',                admin.getStats);
router.get('/attendance/sessions',  admin.getSessionAttendance);
router.get('/activity',             admin.getActivityLog);

// events CRUD (write operations — Admin/Organizer only)
router.post('/events',              admin.createEvent);
router.put('/events/:id',           admin.updateEvent);
router.delete('/events/:id',        admin.deleteEvent);

// sessions (write operations — Admin/Organizer only)
router.post('/sessions',            admin.createSession);

// staff list for FacilitatorDropdown (added Phase 1)
router.get('/staff',                admin.getStaff);

// user management routes for the /admin/users frontend page.
// both are behind verifyToken (already applied globally at the top of this file)
// AND requireRole('Admin') so only an Admin can create or view accounts.
// Organizer is intentionally excluded here because provisioning new accounts
// is a full-system-oversight action that only the Admin role should have.
router.get( '/users',         requireRole('Admin'), userMgmt.listUsers);
router.post('/users',         requireRole('Admin'), validate('createUser'), userMgmt.createUser);

module.exports = router;
