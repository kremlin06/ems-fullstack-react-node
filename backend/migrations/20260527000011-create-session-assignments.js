'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session_assignments', {
      id: {
        type:          Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:    true,
      },
      attendee_id: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
        references: { model: 'users', key: 'id' },
        onDelete:   'CASCADE',
        onUpdate:   'CASCADE',
      },
      session_id: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
        references: { model: 'sessions', key: 'id' },
        onDelete:   'CASCADE',
        onUpdate:   'CASCADE',
      },
      assigned_at: {
        type:         Sequelize.DATE,
        allowNull:    false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('session_assignments', ['session_id', 'attendee_id'], {
      unique: true,
      name:   'idx_session_assignments_unique',
    });

    await queryInterface.addIndex('session_assignments', ['attendee_id'], {
      name: 'idx_session_assignments_attendee',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('session_assignments');
  },
};
