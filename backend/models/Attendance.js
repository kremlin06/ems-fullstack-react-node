'use strict';

// Attendance model — D4 table: records actual check-in for each session
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Attendance extends Model {
  static associate(db) {
    Attendance.belongsTo(db.User, { foreignKey: 'userId',    as: 'user' });
    Attendance.belongsTo(db.Session, { foreignKey: 'sessionId', as: 'session' });
  }
}

Attendance.init(
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
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'session_id',
      references: { model: 'sessions', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM('Present', 'Late', 'Absent'),
      allowNull: false,
      defaultValue: 'Present',
    },
    checkInTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'check_in_time',
    },
    checkOutTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'check_out_time',
    },
  },
  {
    sequelize,
    modelName: 'Attendance',
    tableName: 'attendances',
    timestamps: true,
    underscored: true,
    indexes: [
      // used by NFR-01: queries must return < 2s on 5000+ records
      { fields: ['session_id'], name: 'idx_attendance_sessionid' },
      { fields: ['status'],     name: 'idx_attendance_status' },
      { fields: ['user_id'],    name: 'idx_attendance_user_id' },
    ],
  }
);

module.exports = Attendance;
