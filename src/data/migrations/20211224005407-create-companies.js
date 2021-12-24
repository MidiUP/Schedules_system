'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {

        await queryInterface.createTable('company', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false
            },
            address: {
                type: Sequelize.STRING,
                allowNull: false
            },
            employees: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            logo: {
                type: Sequelize.STRING,
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

        await queryInterface.dropTable('company')

    }
};