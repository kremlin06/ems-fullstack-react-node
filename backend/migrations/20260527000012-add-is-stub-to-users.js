'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // stub users are created during bulk upload for attendees who haven't self-registered yet.
    // they cannot log in (passwordHash is a bcrypt hash of random bytes they never had access to).
    await queryInterface.addColumn('users', 'is_stub', {
      type:         Sequelize.BOOLEAN,
      allowNull:    false,
      defaultValue: false,
    });

    await queryInterface.addIndex('users', ['is_stub'], {
      name: 'idx_users_is_stub',
      where: { is_stub: true }, // partial index — only indexes the minority stub rows
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('users', 'idx_users_is_stub');
    await queryInterface.removeColumn('users', 'is_stub');
  },
};
