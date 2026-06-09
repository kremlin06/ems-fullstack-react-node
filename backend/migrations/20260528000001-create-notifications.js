'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        type:          Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:    true,
      },
      user_id: {
        type:       Sequelize.INTEGER,
        allowNull:  false,
        references: { model: 'users', key: 'id' },
        onDelete:   'CASCADE',
        onUpdate:   'CASCADE',
      },
      type: {
        type:         Sequelize.ENUM('info', 'success', 'warning', 'error'),
        allowNull:    false,
        defaultValue: 'info',
      },
      title: {
        type:      Sequelize.STRING(255),
        allowNull: false,
      },
      message: {
        type:      Sequelize.TEXT,
        allowNull: false,
      },
      is_read: {
        type:         Sequelize.BOOLEAN,
        allowNull:    false,
        defaultValue: false,
      },
      created_at: {
        type:         Sequelize.DATE,
        allowNull:    false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type:         Sequelize.DATE,
        allowNull:    false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('notifications', ['user_id'], {
      name: 'idx_notifications_user_id',
    });

    await queryInterface.addIndex('notifications', ['user_id', 'is_read'], {
      name: 'idx_notifications_user_unread',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notifications');
    // also drop the enum type (postgres keeps it after table drop)
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_notifications_type";`
    );
  },
};
