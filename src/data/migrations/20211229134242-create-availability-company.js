'use strict'

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('availability_company', {
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
            day_of_operation: {
                type: Sequelize.STRING,
                allowNull: false
            },
            opening_time: {
                type: Sequelize.TIME,
                allowNull: false
            },
            closing_time: {
                type: Sequelize.TIME,
                allowNull: false
            },
            is_deleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false

            }

        })
    },

    down: async(queryInterface, Sequelize) => {

        await queryInterface.dropTable('availability_company');

    }
}