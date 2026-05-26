'use strict';

const { Router }       = require('express');
const { register, login, logout, getCurrentUser, refreshAccessToken } = require('../controllers/authController');
const validate         = require('../middleware/validate');
const { verifyToken }  = require('../middleware/auth');
const { authLimiter, registerLimiter } = require('../middleware/rateLimit');

const router = Router();

/**
 * Auth routes — all mounted at /api/auth in server.js
 *
 * Middleware chain for each route (left to right):
 *
 *   POST /register
 *     registerLimiter → validate('register') → register
 *     Rate-limited separately (3/hr) since account creation is riskier than login.
 *
 *   POST /login
 *     authLimiter → validate('login') → login
 *     5 attempts per 15 min to slow brute-force attempts.
 *
 *   POST /logout
 *     authLimiter → logout
 *     No validation needed (reads cookie, not body).
 *     Rate-limited to prevent cookie-clearing spam.
 *
 *   GET /me
 *     verifyToken → getCurrentUser
 *     No rate limit — called on every page load, must be fast.
 *     JWT verification is synchronous and cheap.
 *
 *   POST /refresh
 *     authLimiter → refreshAccessToken
 *     No body validation needed (reads cookie).
 */

router.post('/register', registerLimiter, validate('register'), register);
router.post('/login',    authLimiter,     validate('login'),    login);
router.post('/logout',   authLimiter,                           logout);
router.get( '/me',       verifyToken,                           getCurrentUser);
router.post('/refresh',  authLimiter,                           refreshAccessToken);

module.exports = router;
