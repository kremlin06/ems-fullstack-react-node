'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // add session_id FK to registrations (nullable — attendee may register for event without a specific session)
    await queryInterface.addColumn('registrations', 'session_id', {
      type:       Sequelize.INTEGER,
      allowNull:  true,
      defaultValue: null,
      references: { model: 'sessions', key: 'id' },
      onDelete:   'SET NULL',
      onUpdate:   'CASCADE',
    });

    await queryInterface.addIndex('registrations', ['session_id'], {
      name: 'idx_registrations_session_id',
    });

    await queryInterface.addIndex('registrations', ['event_id', 'session_id'], {
      name: 'idx_registrations_event_session',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('registrations', 'idx_registrations_event_session');
    await queryInterface.removeIndex('registrations', 'idx_registrations_session_id');
    await queryInterface.removeColumn('registrations', 'session_id');
  },
};
