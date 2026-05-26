'use strict';

const { Sequelize } = require('sequelize');
const env = require('./env');

/**
 * Sequelize instance — the single database connection used by the app.
 *
 * All models import `sequelize` from this file (via models/index.js).
 * The CLI uses config/sequelize.js (a plain object) instead.
 *
 * SSL behaviour:
 *  - Local Docker (dev/test): SSL off — Docker runs on localhost, no cert needed.
 *  - Render / Railway (production): SSL on — managed PostgreSQL requires it.
 */

const dialectOptions = env.isProduction
  ? { ssl: { require: true, rejectUnauthorized: false } }
  : {};

const sequelize = new Sequelize(env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions,

  // Keep pool reasonable for a small app — tune up if you see connection timeouts
  pool: {
    max: 10,   // max simultaneous connections
    min: 0,    // allow pool to drain completely when idle
    acquire: 30000, // ms to wait before throwing "unable to acquire connection"
    idle: 10000,    // ms before releasing an idle connection back to the pool
  },

  // Log all SQL in development so you can spot N+1 queries early.
  // Disabled in production — spammy and potentially leaks query data to logs.
  logging: env.isDevelopment ? (sql) => console.log(`\x1b[34m[SQL]\x1b[0m ${sql}`) : false,
});

/**
 * Verify the database connection on startup.
 * Called once from server.js — if this throws, the server won't start.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  await sequelize.authenticate();
  console.log('PostgreSQL connected via Sequelize');
};

module.exports = { sequelize, connectDB };
