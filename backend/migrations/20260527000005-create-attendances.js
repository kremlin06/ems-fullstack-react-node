'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendances', {
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
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sessions', key: 'id' },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('Present', 'Late', 'Absent'),
        allowNull: false,
        defaultValue: 'Present',
      },
      check_in_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      check_out_time: {
        type: Sequelize.DATE,
        allowNull: true,
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

    // nfr-01: queries on 5000+ records must return < 2s — covered by these indexes
    await queryInterface.addIndex('attendances', ['session_id'], { name: 'idx_attendance_sessionid' });
    await queryInterface.addIndex('attendances', ['status'],     { name: 'idx_attendance_status' });
    await queryInterface.addIndex('attendances', ['user_id'],    { name: 'idx_attendance_user_id' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('attendances');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_attendances_status";');
  },
};
