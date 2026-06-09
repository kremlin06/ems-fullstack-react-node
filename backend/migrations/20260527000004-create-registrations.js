'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('registrations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'events', key: 'id' },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('Confirmed', 'Pending', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Confirmed',
      },
      registered_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    await queryInterface.addIndex('registrations', ['user_id'],  { name: 'idx_registrations_user_id' });
    await queryInterface.addIndex('registrations', ['event_id'], { name: 'idx_registrations_event_id' });
    await queryInterface.addIndex('registrations', ['status'],   { name: 'idx_registrations_status' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('registrations');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_registrations_status";');
  },
};
