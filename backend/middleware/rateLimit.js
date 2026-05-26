'use strict';

const rateLimit = require('express-rate-limit');

/**
 * Rate limiters for auth endpoints.
 *
 * Why separate limiters rather than one global one?
 * - Login deserves the tightest limit (brute-force target)
 * - Register is slightly more lenient (testing / first-time users)
 * - /me (getCurrentUser) is read-only and called on every page load,
 *   so we don't want to block legitimate heavy users
 *
 * windowMs / max combinations explained:
 *   authLimiter:     5 attempts per 15 minutes — standard login brute-force protection
 *   registerLimiter: 3 attempts per hour — prevents account-creation spam
 */

/**
 * Standard error response for rate-limited requests.
 * Matches the global error shape: { error: { message, code } }
 */
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    error: {
      message: 'Too many requests — please wait a moment and try again.',
      code:    'RATE_LIMITED',
    },
  });
};

/**
 * Applied to POST /api/auth/login and POST /api/auth/logout.
 * 5 requests per 15-minute window per IP.
 */
const authLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,  // 15 minutes
  max:              5,
  standardHeaders:  true,   // Send RateLimit-* headers so the client can display a countdown
  legacyHeaders:    false,
  handler:          rateLimitHandler,
  // Skip successful requests? No, every attempt counts, success or failure.
  // Counting only failures gives attackers 5 free wrong guesses per window.
  skipSuccessfulRequests: false,
});

/**
 * Applied to POST /api/auth/register.
 * 3 attempts per 60-minute window per IP.
 * Tighter window because account creation is rarely retried more than once.
 */
const registerLimiter = rateLimit({
  windowMs:         60 * 60 * 1000,  // 1 hour
  max:              3,
  standardHeaders:  true,
  legacyHeaders:    false,
  handler:          rateLimitHandler,
  skipSuccessfulRequests: false,
});

module.exports = { authLimiter, registerLimiter };
