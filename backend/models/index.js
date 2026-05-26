'use strict';

/**
 * Model index — loads all models and wires up associations.
 *
 * Import pattern everywhere else in the app:
 *   const { User } = require('../models');
 *
 * Adding a new model:
 *   1. Create models/YourModel.js
 *   2. require() it here and add to the `db` object
 *   3. Call YourModel.associate(db) if it has associations
 */

const { sequelize } = require('../config/database');
const User = require('./User');

// Register models

const db = {
  User,
  sequelize,  // expose instance so callers can do db.sequelize.transaction(...)
};

//Wire up associations 
// Each model defines a static associate(db) method.
// Call them all here so the order never matters.

Object.values(db).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

module.exports = db;
