'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {

        await queryInterface.createTable('user', {
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
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            cpf: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
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

        await queryInterface.dropTable('user');

    }
};