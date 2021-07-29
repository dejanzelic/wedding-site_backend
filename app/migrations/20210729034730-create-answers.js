'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Answers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      inviteId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Invites',
            key: 'id'
          },
        },
      },
      response: {
        type: Sequelize.STRING
      },
      questionId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Questions',
            key: 'id'
          },
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Answers');
  }
};