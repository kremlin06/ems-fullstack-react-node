'use strict';

// health check endpoints
// GET /api/health    — shallow ping; always 200 if the process is alive
// GET /api/health/db — deep check; sequelize.authenticate() (Admin-only)

const express        = require('express');
const { sequelize }  = require('../config/database');
const { verifyToken, requireRole } = require('../middleware/auth');
const env            = require('../config/env');

const router = express.Router();

// GET /api/health
// Called by load balancers, Docker HEALTHCHECK, and uptime monitors.
// Intentionally does NOT check DB — the process itself being up is enough
// for liveness probes.  Use /api/health/db for a readiness probe.
router.get('/', (_req, res) => {
  res.status(200).json({
    status:      'ok',
    environment: env.NODE_ENV,
    timestamp:   new Date().toISOString(),
  });
});

// GET /api/health/db
// Readiness probe — confirms the DB connection pool is healthy.
// Requires Admin role so it is never exposed to ordinary users or scanners.
router.get('/db', verifyToken, requireRole('Admin'), async (_req, res) => {
  try {
    await sequelize.authenticate();
    return res.status(200).json({
      status:    'ok',
      db:        'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(503).json({
      status:    'error',
      db:        'unreachable',
      message:   err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
