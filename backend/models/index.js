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
// added Phase 3 models: Event, Session, Registration, Attendance
const Event = require('./Event');
const Session = require('./Session');
const Registration = require('./Registration');
const Attendance = require('./Attendance');
// added Phase 1 (audit trail): ActivityLog
const ActivityLog = require('./ActivityLog');
// added Phase 2: SessionAssignment (attendee ↔ session junction)
const SessionAssignment = require('./SessionAssignment');
// added Phase 6: Notification — persisted in-app alerts (FR-08 scan confirmations)
const Notification = require('./Notification');

// register models
const db = {
  User,
  Event,
  Session,
  Registration,
  Attendance,
  ActivityLog,
  SessionAssignment,
  Notification,
  sequelize,
};

// Wire up associations
// Each model defines a static associate(db) method.
// Call them all here so the order never matters.

Object.values(db).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

module.exports = db;
