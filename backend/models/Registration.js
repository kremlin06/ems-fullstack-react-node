'use strict';

// Registration model — D3 table: tracks which users registered for which events
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Registration extends Model {
  static associate(db) {
    Registration.belongsTo(db.User,    { foreignKey: 'userId',    as: 'attendee' });
    // old alias kept as comment: was 'user' — renamed to 'attendee' for Phase 2 clarity
    Registration.belongsTo(db.Event,   { foreignKey: 'eventId',   as: 'event' });
    Registration.belongsTo(db.Session, { foreignKey: 'sessionId', as: 'session' });
  }
}

Registration.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: { model: 'users', key: 'id' },
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'event_id',
      references: { model: 'events', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('Confirmed', 'Pending', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Confirmed',
    },
    sessionId: {
      type:      DataTypes.INTEGER,
      allowNull: true,
      field:     'session_id',
      references: { model: 'sessions', key: 'id' },
    },
    registeredAt: {
      type:         DataTypes.DATE,
      allowNull:    false,
      defaultValue: DataTypes.NOW,
      field:        'registered_at',
    },
  },
  {
    sequelize,
    modelName: 'Registration',
    tableName: 'registrations',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_id'],                name: 'idx_registrations_user_id' },
      { fields: ['event_id'],               name: 'idx_registrations_event_id' },
      { fields: ['session_id'],             name: 'idx_registrations_session_id' },
      { fields: ['event_id', 'session_id'], name: 'idx_registrations_event_session' },
      { fields: ['status'],                 name: 'idx_registrations_status' },
    ],
  }
);

module.exports = Registration;
