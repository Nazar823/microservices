const Sequelize = require('sequelize')

module.exports = function (sequelize){
    return sequelize.define('message', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        sender: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        receiver: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        text: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date_time: {
            type: Sequelize.DATE,
            allowNull: false
        },
        read: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    }, {
        timestamps: false
    })
}