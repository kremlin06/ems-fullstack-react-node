'use strict';

const jwt = require('jsonwebtoken');
const env  = require('../config/env');

/**
 * Generate a signed JWT access token.
 *
 * Access tokens are short-lived (15m) and sent in every API request
 * via the Authorization: Bearer header. They are stateless — the server
 * verifies the signature without a DB lookup.
 *
 * Payload is intentionally minimal:
 *   - sub  : user's database ID (standard JWT "subject" claim)
 *   - role : needed by middleware to authorise role-protected routes
 *             without an extra DB query on every request
 *   - iat / exp are added automatically by jsonwebtoken
 *
 * @param {{ id: number, role: string }} user
 * @returns {string} Signed JWT string.
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user.id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRE }
  );
};

/**
 * Generate a signed JWT refresh token.
 *
 * Refresh tokens are long-lived (7d) and stored:
 *   - Client side: in an HTTP-only, Secure, SameSite=Strict cookie
 *     (inaccessible to JavaScript — XSS-safe)
 *   - Server side: as a bcrypt hash in users.refresh_token
 *     (revocable on logout or compromise)
 *
 * Only the user ID is embedded — no role or sensitive data.
 * Role is re-read from the DB when the refresh token is used to
 * issue a new access token, so role changes take effect within 7 days
 * without requiring a forced logout.
 *
 * @param {{ id: number }} user
 * @returns {string} Signed JWT string.
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { sub: user.id },
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRE }
  );
};

/**
 * Verify an access token and return its decoded payload.
 *
 * @param {string} token
 * @returns {{ sub: number, role: string, iat: number, exp: number }}
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError}
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

/**
 * Verify a refresh token and return its decoded payload.
 *
 * @param {string} token
 * @returns {{ sub: number, iat: number, exp: number }}
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError}
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
};

/**
 * Build the options object for the HTTP-only refresh token cookie.
 * Called by authController when setting and clearing the cookie.
 *
 * @param {boolean} [clear=false] - If true, returns options that expire the cookie immediately.
 * @returns {import('express').CookieOptions}
 */
const refreshCookieOptions = (clear = false) => ({
  httpOnly: true,                    // Not readable by JavaScript — XSS protection
  secure:   env.COOKIE_SECURE,       // true in prod (HTTPS only), false in local dev
  sameSite: 'strict',               // Prevents CSRF — cookie not sent cross-origin
  maxAge:   clear ? 0 : 7 * 24 * 60 * 60 * 1000, // 7 days in ms, or expire now
  path:     '/api/auth',            // Cookie only sent to auth endpoints — minimal scope
});

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  refreshCookieOptions,
};
