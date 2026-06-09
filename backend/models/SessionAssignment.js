'use strict';

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

// junction table: attendee ↔ session (many-to-many via explicit model)
// used for post-hoc bulk assignment (separate from registration.session_id which is set at upload time)
class SessionAssignment extends Model {
  static associate(db) {
    SessionAssignment.belongsTo(db.User,    { foreignKey: 'attendeeId', as: 'attendee' });
    SessionAssignment.belongsTo(db.Session, { foreignKey: 'sessionId',  as: 'session'  });
  }
}

SessionAssignment.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },
    attendeeId: {
      type:       DataTypes.INTEGER,
      allowNull:  false,
      field:      'attendee_id',
      references: { model: 'users',    key: 'id' },
    },
    sessionId: {
      type:       DataTypes.INTEGER,
      allowNull:  false,
      field:      'session_id',
      references: { model: 'sessions', key: 'id' },
    },
    assignedAt: {
      type:         DataTypes.DATE,
      allowNull:    false,
      defaultValue: DataTypes.NOW,
      field:        'assigned_at',
    },
  },
  {
    sequelize,
    modelName:  'SessionAssignment',
    tableName:  'session_assignments',
    timestamps: false,
    underscored: true,
    indexes: [
      { unique: true, fields: ['session_id', 'attendee_id'], name: 'idx_session_assignments_unique' },
      { fields: ['attendee_id'], name: 'idx_session_assignments_attendee' },
    ],
  },
);

module.exports = SessionAssignment;
