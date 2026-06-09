'use strict';

const Joi = require('joi');

/**
 * Joi validation schemas for all auth request bodies.
 *
 * Rules applied across all schemas:
 *   - .trim()        strips leading/trailing whitespace before validation
 *   - .lowercase()   normalises email before checking format
 *   - unknown keys   are stripped (Joi default stripUnknown) to prevent
 *                    extra fields from leaking through to the controller
 *
 * Department list matches the ENUM in models/User.js — update both together.
 */

const DEPARTMENTS = ['BSIT', 'BSCS', 'BSBA', 'BSTM', 'BSHM', 'BSE', 'BEED', 'Other'];

const STUDENT_ID_PATTERN = /^[A-Za-z0-9\-]+$/;

const EVENT_STATUSES = ['Draft', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

// Schemas

const schemas = {

   register: Joi.object({
      fullName: Joi.string().trim().min(2).max(100).required()
         .messages({
         'string.min':  'Full name must be at least 2 characters',
         'string.max':  'Full name must be 100 characters or fewer',
         'any.required': 'Full name is required',
         }),

      email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required()
         .messages({
         'string.email': 'Must be a valid email address',
         'any.required': 'Email is required',
         }),

      password: Joi.string().min(8).max(128).required()
         .pattern(/[A-Z]/, 'uppercase letter')
         .pattern(/[0-9]/, 'number')
         .messages({
         'string.min': 'Password must be at least 8 characters',
         'string.max': 'Password must be 128 characters or fewer',
         'string.pattern.name': 'Password must contain at least one {#name}',
         'any.required': 'Password is required',
         }),

      // Optional — students provide these; staff/admin may not
      studentId: Joi.string().trim().uppercase().max(30)
         .pattern(STUDENT_ID_PATTERN)
         .optional().allow('', null)
         .messages({
         'string.pattern.base': 'Student ID may only contain letters, numbers, and hyphens',
         }),

      department: Joi.string().valid(...DEPARTMENTS)
         .optional().allow('', null)
         .messages({
         'any.only': `Department must be one of: ${DEPARTMENTS.join(', ')}`,
         }),
   }),

   login: Joi.object({
      email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required()
         .messages({
         'string.email': 'Must be a valid email address',
         'any.required': 'Email is required',
         }),

      password: Joi.string().max(128).required()
         .messages({
         'any.required': 'Password is required',
         }),
   }),

   // Forgot / Reset Password 

   forgotPassword: Joi.object({
      email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required()
         .messages({
         'string.email': 'Must be a valid email address',
         'any.required': 'Email is required',
         }),
   }),

   // Event creation / update 

   event: Joi.object({
      title: Joi.string().trim().min(2).max(255).required()
         .messages({
         'string.min': 'Event name must be at least 2 characters',
         'any.required': 'Event name is required',
         }),

      date: Joi.date().iso().required()
         .messages({
         'date.base': 'Date must be a valid date',
         'any.required': 'Date is required',
         }),

      venue: Joi.string().trim().max(500).optional().allow('', null),

      description: Joi.string().trim().max(2000).optional().allow('', null),

      status: Joi.string().valid(...EVENT_STATUSES).default('Upcoming'),

      capacity: Joi.number().integer().min(1).max(100000).default(100),

      imageUrl: Joi.string().trim().max(5000).optional().allow('', null),
   }),

   // Session creation

   session: Joi.object({
      eventId: Joi.number().integer().positive().required()
         .messages({ 'any.required': 'eventId is required' }),

      title: Joi.string().trim().min(2).max(255).required()
         .messages({
         'string.min':  'Session title must be at least 2 characters',
         'any.required': 'Session title is required',
         }),

      schedule: Joi.date().iso().optional().allow(null),

      capacity: Joi.number().integer().min(1).max(100000).default(50),

      facilitatorId: Joi.number().integer().positive().optional().allow(null),
   }),

   // Attendee manual entry

   attendeeManual: Joi.object({
      fullName:   Joi.string().trim().min(2).max(100).required()
         .messages({ 'any.required': 'Full name is required' }),
      email:      Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required()
         .messages({ 'any.required': 'Email is required', 'string.email': 'Invalid email' }),
      studentId:  Joi.string().trim().uppercase().max(30).optional().allow('', null),
      department: Joi.string().valid('BSIT','BSCS','BSBA','BSTM','BSHM','BSE','BEED','Other')
         .optional().allow('', null),
      eventId:    Joi.number().integer().positive().required()
         .messages({ 'any.required': 'eventId is required' }),
      sessionId:  Joi.number().integer().positive().optional().allow(null),
   }),

   // Bulk session assignment 

   assignSessions: Joi.object({
      attendeeIds: Joi.array().items(Joi.number().integer().positive()).min(1).required()
         .messages({ 'any.required': 'attendeeIds is required', 'array.min': 'Select at least one attendee' }),
      sessionIds:  Joi.array().items(Joi.number().integer().positive()).min(1).required()
         .messages({ 'any.required': 'sessionIds is required',  'array.min': 'Select at least one session' }),
   }),

   // this schema is used when an admin creates a new admin, organizer, or staff account.
   // attendee accounts are created through the public /auth/register endpoint instead.
   // we list exactly which roles are allowed so a crafted request cannot sneak in
   // an invalid role string like "SuperAdmin" that does not exist in the system.
   createUser: Joi.object({
      fullName: Joi.string().trim().min(2).max(100).required()
         .messages({
         'string.min':   'Full name must be at least 2 characters',
         'any.required': 'Full name is required',
         }),

      // email becomes the login identifier for the new account
      email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required()
         .messages({
         'string.email': 'Must be a valid email address',
         'any.required': 'Email is required',
         }),

      // the admin sets an initial password that the new user can change later
      password: Joi.string().min(8).max(128).required()
         .pattern(/[A-Z]/, 'uppercase letter')
         .pattern(/[0-9]/, 'number')
         .messages({
         'string.min':          'Password must be at least 8 characters',
         'string.pattern.name': 'Password must contain at least one {#name}',
         'any.required':        'Password is required',
         }),

      // only these three roles can be assigned here.
      // attendee is intentionally excluded because self-registration handles that.
      role: Joi.string().valid('Admin', 'Organizer', 'Staff').required()
         .messages({
         'any.only':     'Role must be Admin, Organizer, or Staff',
         'any.required': 'Role is required',
         }),
   }),

   // Analytics / export filter params (query-string validated via middleware)

   analyticsFilters: Joi.object({
      eventId:   Joi.number().integer().positive().optional(),
      sessionId: Joi.number().integer().positive().optional(),
      startDate: Joi.date().iso().optional(),
      endDate:   Joi.date().iso().min(Joi.ref('startDate')).optional(),
   }),

   exportParams: Joi.object({
      eventId:   Joi.number().integer().positive().optional(),
      sessionId: Joi.number().integer().positive().optional(),
      startDate: Joi.date().iso().optional(),
      endDate:   Joi.date().iso().optional(),
      format:    Joi.string().valid('csv', 'pdf').default('csv'),
      limit:     Joi.number().integer().min(1).max(10000).default(1000),
   }),

   // QR scan (Phase 4) 

   scanPayload: Joi.object({
      sessionId:    Joi.number().integer().positive().required()
         .messages({ 'any.required': 'sessionId is required' }),
      attendeeCode: Joi.string().trim().min(10).required()
         .messages({ 'any.required': 'attendeeCode is required' }),
   }),

   manualOverride: Joi.object({
      status: Joi.string().valid('Present', 'Late', 'Absent').required()
         .messages({
         'any.only':     'status must be Present, Late, or Absent',
         'any.required': 'status is required',
         }),
   }),

   // Reset Password

   resetPassword: Joi.object({
      // Raw hex token from the reset URL — 64 chars (32 bytes as hex)
      token: Joi.string().hex().length(64).required()
         .messages({
         'string.hex':    'Invalid reset token format',
         'string.length': 'Invalid reset token format',
         'any.required':  'Reset token is required',
         }),

      newPassword: Joi.string().min(8).max(128).required()
         .pattern(/[A-Z]/, 'uppercase letter')
         .pattern(/[0-9]/, 'number')
         .messages({
         'string.min':          'Password must be at least 8 characters',
         'string.max':          'Password must be 128 characters or fewer',
         'string.pattern.name': 'Password must contain at least one {#name}',
         'any.required':        'Password is required',
         }),
   }),

};

// Middleware factory

/**
 * Returns Express middleware that validates req.body against a named schema.
 *
 * On validation failure: responds 400 with the FIRST error message only.
 * Returning all errors at once trains users to fix one field at a time,
 * which is how most form UIs work anyway.
 *
 * On success: req.body is replaced with the Joi-cleaned value
 * (trimmed, lowercased, unknown keys stripped) so controllers get
 * clean data with no extra processing.
 *
 * @param {'register'|'login'} schemaName
 * @returns {import('express').RequestHandler}
 */
const validate = (schemaName) => (req, res, next) => {
  const schema = schemas[schemaName];

  if (!schema) {
    // Developer error — unknown schema name
    console.error(`[validate] Unknown schema: "${schemaName}"`);
    return res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } });
  }

  const { error, value } = schema.validate(req.body, {
    abortEarly: true,   // stop at first error — matches single-error form UX
    stripUnknown: true,   // drop unknown keys (prevents mass-assignment)
    convert: true,   // allow Joi to trim/lowercase/etc.
  });

  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
        code: 'VALIDATION_ERROR',
        field: error.details[0].context?.key ?? null,
      },
    });
  }

  // Replace body with the sanitised value from Joi
  req.body = value;
  next();
};

module.exports = validate;
