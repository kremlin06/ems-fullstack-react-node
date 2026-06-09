'use strict';

const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('../utils/generateTokens');

/**
 * verifyToken — protects routes that require a logged-in user.
 *
 * Reads the JWT from the Authorization header:
 *   Authorization: Bearer <access_token>
 *
 * On success:
 *   Attaches a minimal user object to req.user:
 *     { id: number, role: string }
 *   Calls next() to proceed to the route handler.
 *
 * On failure:
 *   Returns 401 with a consistent error shape.
 *   Never calls next() — the request stops here.
 *
 * Why not also check the DB here?
 *   For Phase 1, we trust the JWT signature alone for access tokens.
 *   If you need immediate token revocation (e.g. force-logout on password change),
 *   add a `tokenVersion` column to User and include it in the JWT payload —
 *   then compare it here. That's a Phase 2 enhancement.

 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // EventSource (SSE) cannot send custom headers, so fall back to ?token= query param
  // for the stream endpoint. Only used when there is no Authorization header.
  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (req.query.token) { // parameter fallback for SSE (Server-Sent Events) clients 
    token = req.query.token;
  } else {
    return res.status(401).json({
      error: {
        message: 'Authentication required. Please log in.',
        code:    'NO_TOKEN',
      },
    });
  }

  try {
    const decoded = verifyAccessToken(token);

    // Attach only what downstream handlers need — no full DB object
    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: {
          message: 'Your session has expired. Please log in again.',
          code: 'TOKEN_EXPIRED',
        },
      });
    }

    // Covers JsonWebTokenError (malformed), NotBeforeError, etc.
    return res.status(401).json({
      error: {
        message: 'Invalid authentication token.',
        code: 'INVALID_TOKEN',
      },
    });
  }
};

/**
 * requireRole — restricts a route to one or more specific roles.
 *
 * Must be used AFTER verifyToken (depends on req.user being set).

 * Usage:
 *   router.get('/admin-only', verifyToken, requireRole('Admin'), handler);
 *   router.get('/staff-or-admin', verifyToken, requireRole('Admin', 'Staff'), handler);

 * @param {...string} roles - Allowed roles (e.g. 'Admin', 'Staff')
 * @returns {import('express').RequestHandler}
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    // Developer error — requireRole was used without verifyToken before it
    return res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: {
        message: 'You do not have permission to access this resource.',
        code: 'FORBIDDEN',
      },
    });
  }

  next();
};

module.exports = { verifyToken, requireRole };
