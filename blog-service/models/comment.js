const Sequelize = require('sequelize')

module.exports = function (sequelize){
    let comments = sequelize.define('comment', {
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
        post: {
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
        }
    }, {
        timestamps: false
    })
    return comments
}