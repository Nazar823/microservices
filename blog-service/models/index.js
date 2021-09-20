const Sequelize = require('sequelize')

module.exports = function (sequelize){
    let post = require('/models/post')(sequelize)
    let comments = require('/models/comment')(sequelize)
    post.hasMany(comments, {as: "post", foreignKey: "post", thwough: "post"})
    sequelize.sync()
}