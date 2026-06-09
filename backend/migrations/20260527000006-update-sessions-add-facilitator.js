'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // add title — new canonical name field
    await queryInterface.addColumn('sessions', 'title', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    // add schedule — single TIMESTAMP replacing start_time + end_time
    await queryInterface.addColumn('sessions', 'schedule', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // add facilitator_id FK → users (nullable; session can exist without a facilitator)
    await queryInterface.addColumn('sessions', 'facilitator_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onDelete: 'SET NULL',
    });

    // backfill: copy name → title and start_time → schedule for any existing rows
    await queryInterface.sequelize.query(`
      UPDATE sessions
      SET title    = name,
          schedule = start_time
      WHERE title IS NULL;
    `);

    // make name nullable so new sessions can omit it (title is now the required field)
    await queryInterface.changeColumn('sessions', 'name', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addIndex('sessions', ['facilitator_id'], {
      name: 'idx_sessions_facilitator_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('sessions', 'idx_sessions_facilitator_id');
    await queryInterface.removeColumn('sessions', 'facilitator_id');
    await queryInterface.removeColumn('sessions', 'schedule');
    await queryInterface.removeColumn('sessions', 'title');

    // restore name to NOT NULL
    await queryInterface.changeColumn('sessions', 'name', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  },
};
