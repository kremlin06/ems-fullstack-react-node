'use strict';

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ActivityLog extends Model {
  static associate(db) {
    ActivityLog.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
  }
}

ActivityLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id',
      references: { model: 'users', key: 'id' },
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'entity_type',
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'entity_id',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: 'ActivityLog',
    tableName: 'activity_logs',
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ['user_id'],                  name: 'idx_activity_logs_user_id' },
      { fields: ['entity_type', 'entity_id'], name: 'idx_activity_logs_entity' },
      { fields: ['created_at'],               name: 'idx_activity_logs_created_at' },
    ],
  }
);

module.exports = ActivityLog;
