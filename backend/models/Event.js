'use strict';

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Event extends Model {
  static associate(db) {
    Event.hasMany(db.Session, { foreignKey: 'eventId',  as: 'sessions' });
    Event.hasMany(db.Registration, { foreignKey: 'eventId',  as: 'registrations' });
    Event.belongsTo(db.User, { foreignKey: 'createdBy', as: 'creator' });
  }
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: { msg: 'Event title cannot be blank' } },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    venue: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Upcoming', 'Ongoing', 'Completed', 'Draft', 'Cancelled'),
      allowNull: false,
      defaultValue: 'Upcoming',
    },
    // image stored as URL path or base64 data URL
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'image_url',
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'created_by',
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Event;
