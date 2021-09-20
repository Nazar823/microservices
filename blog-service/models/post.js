const Sequelize = require('sequelize')

module.exports = function (sequelize){
    let post = sequelize.define('post', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        author: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        text: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        attachments: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        date_time: {
            type: Sequelize.DATE,
            allowNull: false
        }
    }, {
        timestamps: false
    })
    return post
}