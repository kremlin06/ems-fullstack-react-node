'use strict';

/**
 * server.js — Express application entry point.
 *
 * Startup sequence:
 *   1. Load and validate environment variables
 *   2. Connect to PostgreSQL
 *   3. Configure Express (CORS, body parsing, cookies, request logging)
 *   4. Mount route handlers
 *   5. Attach global error handler
 *   6. Start listening
 *
 * Shutdown:
 *   SIGTERM / SIGINT close the DB connection pool before exiting,
 *   so in-flight queries finish cleanly (important on Render/Railway
 *   which send SIGTERM before killing the process).
 */

const env = require('./config/env'); // ← must be first; validates all vars before anything else loads

const express        = require('express');
const cors           = require('cors');
const cookieParser   = require('cookie-parser');
const morgan         = require('morgan');
const logger         = require('./utils/logger');
// added Phase 5: 301 HTTP→HTTPS redirect in production
const httpsRedirect  = require('./middleware/httpsRedirect');

const { connectDB, sequelize } = require('./config/database');
const authRoutes               = require('./routes/authRoutes');
// added admin routes for dashboard stats, session attendance, activity log, events crud
const adminRoutes              = require('./routes/adminRoutes');
// added Phase 2: attendee management, bulk upload, session assignment
const attendeeRoutes           = require('./routes/attendeeRoutes');
// added Phase 3: analytics overview/sessions, report preview/export
const analyticsRoutes          = require('./routes/analyticsRoutes');
// added Phase 4: QR scan, SSE live feed, manual override, attendee QR code generation
const attendanceRoutes         = require('./routes/attendanceRoutes');
// added Phase 5: /api/health and /api/health/db (replaces inline handler)
const healthRoutes             = require('./routes/healthRoutes');
// added Phase 5: Attendee-facing portal routes (events/open, attendee/schedule, etc.)
const attendeePortalRoutes     = require('./routes/attendeePortalRoutes');
// added Phase 6: generic, role-agnostic notifications (/api/notifications)
const notificationRoutes       = require('./routes/notificationRoutes');

// App setup

const app = express();

// HTTPS redirect — must be the very first middleware so redirects fire before
// CORS or body parsing add unnecessary overhead on plain-HTTP requests
app.use(httpsRedirect);

// CORS
// Parse comma-separated CORS_ORIGIN env var into an array so multiple
// origins can be allowed without code changes (e.g. dev + staging).
const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin "${origin}" is not allowed`));
  },
  credentials: true,  // Required so the browser sends the refresh token cookie cross-origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
// json limit stays at 10kb for API calls; multer handles multipart (file uploads) independently
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Cookies 
app.use(cookieParser());

// Request logging
// 'dev' format: colorised, one line per request — perfect for local dev
// 'combined' format: Apache log format — better for log aggregation in prod
app.use(morgan(env.isDevelopment ? 'dev' : 'combined'));

// Routes
// health routes first — no auth required for the shallow ping
app.use('/api/health', healthRoutes);
app.use('/api/auth',  authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', attendeeRoutes);
app.use('/api/admin', analyticsRoutes);
app.use('/api/attendance', attendanceRoutes);
// Attendee portal endpoints — events/open, attendee/schedule, attendee/attendance, etc.
app.use('/api', attendeePortalRoutes);
// Generic notifications — any authenticated role, scoped to req.user.id
app.use('/api/notifications', notificationRoutes);

// 404 handler
// Catches requests to routes that don't exist.
// Must come AFTER all route registrations.
app.use((_req, res) => {
  res.status(404).json({
    error: { message: 'Route not found.', code: 'NOT_FOUND' },
  });
});

// Global error handler
// Express calls this when next(err) is invoked or an async handler throws.
// Four-parameter signature is required by Express to identify it as an error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // CORS errors surface here — give a clear message instead of a generic 500
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({
      error: { message: err.message, code: 'CORS_ERROR' },
    });
  }

  logger.error('[server] Unhandled error', err);

  // Never expose stack traces or internal error details to the client
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: env.isDevelopment ? err.message : 'An unexpected error occurred.',
      code:    'INTERNAL_ERROR',
    },
  });
});

// Startup

const start = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info('EMS backend running', {
      environment: env.NODE_ENV,
      port:        env.PORT,
      corsOrigins: allowedOrigins,
      health:      `http://localhost:${env.PORT}/api/health`,
    });
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    logger.info(`[server] ${signal} received — shutting down gracefully`);

    server.close(async () => {
      try {
        await sequelize.close();
        logger.info('[server] Database connection pool closed.');
      } catch (err) {
        logger.error('[server] Error closing DB pool', err);
      }
      logger.info('[server] Shutdown complete.');
      process.exit(0);
    });

    // Force-exit if graceful shutdown takes longer than 10s
    setTimeout(() => {
      logger.error('[server] Graceful shutdown timed out — force exiting.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
};

start().catch((err) => {
  logger.error('[server] Startup failed', err);
  process.exit(1);
});
