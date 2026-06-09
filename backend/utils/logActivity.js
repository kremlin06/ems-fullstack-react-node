'use strict';

const { ActivityLog } = require('../models');

/**
 * Non-blocking audit log writer.
 * Called after every mutation (event create/update/delete, session create, etc.).
 * Never throws — a logging failure must never crash the request.
 *
 * @param {number|null} userId      - ID of the user performing the action (null for system)
 * @param {string}      action      - Short action label, e.g. 'EVENT_CREATED'
 * @param {string}      entityType  - Table name or domain noun, e.g. 'event', 'session'
 * @param {number|null} entityId    - PK of the affected record
 * @param {string}      description - Human-readable summary
 * @param {Object}      metadata    - Additional JSONB payload (before/after diffs, etc.)
 */
const logActivity = async (userId, action, entityType, entityId, description, metadata = {}) => {
  try {
    await ActivityLog.create({ userId, action, entityType, entityId, description, metadata });
  } catch (err) {
    // intentionally non-fatal — log the failure but never propagate it
    console.error('[logActivity] write failed:', err.message);
  }
};

module.exports = logActivity;
