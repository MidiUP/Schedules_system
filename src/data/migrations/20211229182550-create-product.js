'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {

        await queryInterface.createTable('product', {
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
            description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            image: {
                type: Sequelize.STRING,
                allowNull: false
            },
            price: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            service_duration: {
                type: Sequelize.INTEGER,
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

        await queryInterface.dropTable('product');

    }
};