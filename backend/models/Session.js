'use strict';

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Session extends Model {
  static associate(db) {
    Session.belongsTo(db.Event, { foreignKey: 'eventId',      as: 'event' });
    Session.belongsTo(db.User, { foreignKey: 'facilitatorId', as: 'facilitator' });
    Session.hasMany(db.Attendance, { foreignKey: 'sessionId',    as: 'attendances' });
  }
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'event_id',
      references: { model: 'events', key: 'id' },
    },

    // title — canonical session name (replaces name; added migration 000006)
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'title',
    },

    // schedule — single timestamp replacing start_time + end_time (added migration 000006)
    schedule: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'schedule',
    },

    // facilitatorId — staff/organizer assigned to this session (added migration 000006)
    facilitatorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'facilitator_id',
      references: { model: 'users', key: 'id' },
    },

    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 50,
    },

    // old fields — kept nullable for backwards compat with existing data; do not use in new code
    // name was the original session label before title was introduced
    // name: { type: DataTypes.STRING(255), allowNull: true, field: 'name' },
    // startTime: { type: DataTypes.DATE, allowNull: true, field: 'start_time' },
    // endTime:   { type: DataTypes.DATE, allowNull: true, field: 'end_time' },
  },
  {
    sequelize,
    modelName: 'Session',
    tableName: 'sessions',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['event_id'],       name: 'idx_sessions_event_id' },
      { fields: ['facilitator_id'], name: 'idx_sessions_facilitator_id' },
    ],
  }
);

module.exports = Session;
