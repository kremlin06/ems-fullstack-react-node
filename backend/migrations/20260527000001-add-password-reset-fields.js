'use strict';

/**
 * Migration: add password_reset_token and password_reset_expiry to users.
 *
 * Why SHA-256 stored as STRING(64)?
 *   - SHA-256 always produces a 64-char hex digest — fixed, predictable length.
 *   - We hash the raw token before storage so a DB breach
 *     cannot be used to reset any account.
 *
 * Run:   npx sequelize-cli db:migrate
 * Undo:  npx sequelize-cli db:migrate:undo
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'password_reset_token', {
      type:         Sequelize.STRING(64),   // SHA-256 hex digest is always 64 chars
      allowNull:    true,
      defaultValue: null,
      comment:      'SHA-256 hash of the raw reset token. NULL = no active reset.',
    });

    await queryInterface.addColumn('users', 'password_reset_expiry', {
      type:         Sequelize.DATE,
      allowNull:    true,
      defaultValue: null,
      comment:      'UTC expiry of the reset token (1 hour after request).',
    });

    // Index so we can look up by token hash without a full table scan.
    // Partial index (WHERE NOT NULL) keeps it lean.
    await queryInterface.addIndex('users', ['password_reset_token'], {
      name:  'users_password_reset_token_idx',
      where: { password_reset_token: { [Sequelize.Op.ne]: null } },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('users', 'users_password_reset_token_idx');
    await queryInterface.removeColumn('users', 'password_reset_expiry');
    await queryInterface.removeColumn('users', 'password_reset_token');
  },
};
