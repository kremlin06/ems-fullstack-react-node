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

const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const morgan       = require('morgan');

const { connectDB, sequelize } = require('./config/database');
const authRoutes               = require('./routes/authRoutes');

// ─── App setup ────────────────────────────────────────────────────────────────

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
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

// ── Body parsing ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Reject absurdly large bodies early
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// ── Cookies ───────────────────────────────────────────────────────────────────
app.use(cookieParser());

// ── Request logging ───────────────────────────────────────────────────────────
// 'dev' format: colorised, one line per request — perfect for local dev
// 'combined' format: Apache log format — better for log aggregation in prod
app.use(morgan(env.isDevelopment ? 'dev' : 'combined'));

// ─── Health check ────────────────────────────────────────────────────────────
// Called by Docker, Render, Railway, and load balancers.
// Returns 200 even if the DB is down — the container is alive, just unhealthy.
// A separate /api/health/db endpoint can check DB connectivity.
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: env.NODE_ENV,
    timestamp:   new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────────
// Catches requests to routes that don't exist.
// Must come AFTER all route registrations.
app.use((_req, res) => {
  res.status(404).json({
    error: { message: 'Route not found.', code: 'NOT_FOUND' },
  });
});

// ─── Global error handler ─────────────────────────────────────────────────────
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

  console.error('[server] Unhandled error:', err);

  // Never expose stack traces or internal error details to the client
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: env.isDevelopment ? err.message : 'An unexpected error occurred.',
      code:    'INTERNAL_ERROR',
    },
  });
});

// ─── Startup ──────────────────────────────────────────────────────────────────

const start = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`\n🚀 EMS backend running`);
    console.log(`   Environment : ${env.NODE_ENV}`);
    console.log(`   Port        : ${env.PORT}`);
    console.log(`   CORS origins: ${allowedOrigins.join(', ')}`);
    console.log(`   API health  : http://localhost:${env.PORT}/api/health\n`);
  });

  // ─── Graceful shutdown ────────────────────────────────────────────────────
  const shutdown = async (signal) => {
    console.log(`\n[server] ${signal} received — shutting down gracefully...`);

    server.close(async () => {
      try {
        await sequelize.close();
        console.log('[server] Database connection pool closed.');
      } catch (err) {
        console.error('[server] Error closing DB pool:', err.message);
      }
      console.log('[server] Shutdown complete. Goodbye.');
      process.exit(0);
    });

    // Force-exit if graceful shutdown takes longer than 10s
    setTimeout(() => {
      console.error('[server] Graceful shutdown timed out — force exiting.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
};

start().catch((err) => {
  console.error('[server] Startup failed:', err);
  process.exit(1);
});
