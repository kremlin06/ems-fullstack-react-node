'use strict';

/**
 * Environment variable loader and validator.
 *
 * Centralises all process.env access in one place. Every other file
 * imports from here instead of reading process.env directly — so if a
 * variable is missing or misnamed, you get ONE clear error at startup
 * rather than a cryptic crash deep inside a route handler at 2am.
 *
 * Usage:
 *   const env = require('./env');
 *   console.log(env.PORT);           // number
 *   console.log(env.JWT_SECRET);     // string
 *   console.log(env.isProduction);   // boolean helper
 */

require('dotenv').config();

// Helpers

/**
 * Read a required string variable. Throws if absent or empty.
 * @param {string} key
 * @returns {string}
 */
const requireString = (key) => {
  const val = process.env[key];
  if (!val || val.trim() === '') {
    throw new Error(
      `[env] Missing required environment variable: ${key}\n` +
      `      Copy backend/.env.example to backend/.env and fill in all values.`
    );
  }
  return val.trim();
};

/**
 * Read an optional string variable with a fallback default.
 * @param {string} key
 * @param {string} defaultValue
 * @returns {string}
 */
const optionalString = (key, defaultValue) => {
  const val = process.env[key];
  return (val && val.trim() !== '') ? val.trim() : defaultValue;
};

/**
 * Read an integer variable with a fallback default.
 * @param {string} key
 * @param {number} defaultValue
 * @returns {number}
 */
const optionalInt = (key, defaultValue) => {
  const val = process.env[key];
  const parsed = parseInt(val, 10);
  return Number.isFinite(parsed) ? parsed : defaultValue;
};

/**
 * Read a boolean variable ("true" → true, anything else → false).
 * @param {string} key
 * @param {boolean} defaultValue
 * @returns {boolean}
 */
const optionalBool = (key, defaultValue) => {
  const val = process.env[key];
  if (val === undefined || val === null || val.trim() === '') return defaultValue;
  return val.trim().toLowerCase() === 'true';
};

// Warn about insecure secrets in production

const PLACEHOLDER_SECRETS = [
  'CHANGE_ME_use_a_long_random_string_at_least_64_chars_in_production',
  'CHANGE_ME_another_long_random_string_different_from_jwt_secret',
];

const warnIfPlaceholder = (key, value) => {
  if (PLACEHOLDER_SECRETS.includes(value)) {
    if (process.env.NODE_ENV === 'production') {
      // Hard fail in production — placeholder secrets are a security disaster
      throw new Error(
        `[env] CRITICAL: ${key} is still using the placeholder value from .env.example.\n` +
        `      Generate a real secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
      );
    } else {
      // Warn loudly in dev but don't block startup
      console.warn(
        `\n⚠️  [env] WARNING: ${key} is using the .env.example placeholder.\n` +
        `   This is fine for local dev but MUST be changed before deploying.\n` +
        `   Generate one: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"\n`
      );
    }
  }
};

// Parse & export

const NODE_ENV    = optionalString('NODE_ENV', 'development');
const JWT_SECRET  = requireString('JWT_SECRET');
const RT_SECRET   = requireString('REFRESH_TOKEN_SECRET');
const HMAC_SECRET = requireString('HMAC_SECRET');

warnIfPlaceholder('JWT_SECRET', JWT_SECRET);
warnIfPlaceholder('REFRESH_TOKEN_SECRET', RT_SECRET);
warnIfPlaceholder('HMAC_SECRET', HMAC_SECRET);

const env = {
  // Server
  NODE_ENV,
  PORT: optionalInt('PORT', 5000),

  // Database
  DATABASE_URL: requireString('DATABASE_URL'),

  // JWT
  JWT_SECRET,
  JWT_EXPIRE:            optionalString('JWT_EXPIRE', '15m'),
  REFRESH_TOKEN_SECRET:  RT_SECRET,
  REFRESH_TOKEN_EXPIRE:  optionalString('REFRESH_TOKEN_EXPIRE', '7d'),

  // Bcrypt
  BCRYPT_ROUNDS: optionalInt('BCRYPT_ROUNDS', 12),

  // CORS — comma-separated list of allowed origins
  // e.g. "http://localhost:5173,https://myapp.vercel.app"
  CORS_ORIGIN: optionalString('CORS_ORIGIN', 'http://localhost:5173'),

  // Cookies
  COOKIE_SECURE: optionalBool('COOKIE_SECURE', false),

  // QR Attendance — Phase 4
  HMAC_SECRET,
  LATE_THRESHOLD_MINUTES: optionalInt('LATE_THRESHOLD_MINUTES', 15),

  // Convenience booleans
  isProduction:  NODE_ENV === 'production',
  isDevelopment: NODE_ENV === 'development',
  isTest:        NODE_ENV === 'test',
};

module.exports = env;
