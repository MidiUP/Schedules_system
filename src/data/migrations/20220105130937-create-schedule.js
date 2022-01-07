'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {

        await queryInterface.createTable('schedule', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            id_company: {
                type: Sequelize.INTEGER,
                references: { model: 'company', key: 'id' },
                allowNull: false
            },
            id_user: {
                type: Sequelize.INTEGER,
                references: { model: 'user', key: 'id' },
                allowNull: false
            },
            date_start: {
                type: Sequelize.DATE,
                allowNull: false
            },
            date_end: {
                type: Sequelize.DATE,
                allowNull: false
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        });

    },

    down: async(queryInterface, Sequelize) => {

        await queryInterface.dropTable('schedule');

    }
};