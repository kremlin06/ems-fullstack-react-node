'use strict';

// Notification model — persists in-app alerts for each user.
// populated by:
//   - attendance scan (FR-08 requires confirmation on successful check-in)
// future: registration, session assignment, system alerts
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Notification extends Model {
  static associate(db) {
    Notification.belongsTo(db.User, { foreignKey: 'userId', as: 'recipient' });
  }
}

Notification.init(
  {
    id: {
      type:          DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:    true,
    },
    userId: {
      type:       DataTypes.INTEGER,
      allowNull:  false,
      field:      'user_id',
      references: { model: 'users', key: 'id' },
    },
    type: {
      type:         DataTypes.ENUM('info', 'success', 'warning', 'error'),
      allowNull:    false,
      defaultValue: 'info',
    },
    title: {
      type:      DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type:      DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type:         DataTypes.BOOLEAN,
      allowNull:    false,
      defaultValue: false,
      field:        'is_read',
    },
  },
  {
    sequelize,
    modelName:  'Notification',
    tableName:  'notifications',
    timestamps: true,
    underscored: true,
    indexes: [
      // used by getNotifications — filter by user, order by created_at
      { fields: ['user_id'],             name: 'idx_notifications_user_id' },
      // used by markAllRead — WHERE user_id AND is_read = false
      { fields: ['user_id', 'is_read'],  name: 'idx_notifications_user_unread' },
    ],
  }
);

module.exports = Notification;
