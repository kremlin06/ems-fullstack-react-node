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

// ─── Schemas ──────────────────────────────────────────────────────────────────

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
        'string.min':           'Password must be at least 8 characters',
        'string.max':           'Password must be 128 characters or fewer',
        'string.pattern.name':  'Password must contain at least one {#name}',
        'any.required':         'Password is required',
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

};

// ─── Middleware factory ───────────────────────────────────────────────────────

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
    abortEarly:   true,   // stop at first error — matches single-error form UX
    stripUnknown: true,   // drop unknown keys (prevents mass-assignment)
    convert:      true,   // allow Joi to trim/lowercase/etc.
  });

  if (error) {
    return res.status(400).json({
      error: {
        message: error.details[0].message,
        code:    'VALIDATION_ERROR',
        field:   error.details[0].context?.key ?? null,
      },
    });
  }

  // Replace body with the sanitised value from Joi
  req.body = value;
  next();
};

module.exports = validate;
