'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {

        await queryInterface.createTable('product_schedule', {
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
            id_schedule: {
                type: Sequelize.INTEGER,
                references: { model: 'schedule', key: 'id' },
                allowNull: false
            },
            id_product: {
                type: Sequelize.INTEGER,
                references: { model: 'product', key: 'id' },
                allowNull: false
            },
            quantity_product: {
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

        await queryInterface.dropTable('products_schedules');

    }
};