'use strict';

/**
 * Sequelize CLI database configuration.
 *
 * This file is consumed ONLY by sequelize-cli (db:migrate, db:migrate:undo, etc.).
 * The application itself uses config/database.js (the Sequelize instance).
 *
 * We load dotenv here so the CLI can read DATABASE_URL when you run:
 *   npx sequelize-cli db:migrate
 * from the command line without the full app booting.
 */

require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    '[sequelize.js] DATABASE_URL is not set.\n' +
    'Create backend/.env from backend/.env.example and set DATABASE_URL.'
  );
}

// Shared SSL options — disabled locally (Docker), enabled on Render/Railway
const dialectOptions =
  process.env.NODE_ENV === 'production'
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {};

module.exports = {
  development: {
    url: DATABASE_URL,
    dialect: 'postgres',
    dialectOptions,
    logging: false, // set to console.log to see every SQL query during dev
  },

  test: {
    url: DATABASE_URL,
    dialect: 'postgres',
    dialectOptions,
    logging: false,
  },

  production: {
    url: DATABASE_URL,
    dialect: 'postgres',
    dialectOptions,
    logging: false,
  },
};
