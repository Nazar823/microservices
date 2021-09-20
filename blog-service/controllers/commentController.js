const axios = require('axios')
const commentModel = require('../connection').comment
const postModel = require('../connection').post
const statusOK = {code: 200, description: 'OK'}
const statusErr = {code: 400, description: 'Bad Request'}

module.exports.createComment = async (req, res) => {
    try {
        const {post, text} = req.body
        const {token} = req.headers
        if (await existPost(post)){
            return res.status(statusErr.code).json({message: 'This post not exists!'})
        }
        const author = Object(await checkToken(token)).id
        if (!author) {
            return res.status(statusErr.code).json({message: 'You not authorizated!'})
        }
        commentModel.create({
            author: author,
            post: post,
            text: text,
            date_time: Date.now()
        })
        return res.status(statusOK.code).json({message: 'Comment posted!'})
    } catch (e) {
        return res.status(statusErr.code).json({message: e.message})
    }
}

module.exports.findCommentsByPost = async (req, res) => {
    try {
        const {post} = req.body
        if (await existPost(post)){
            return res.status(statusErr.code).json({message: 'This post not exist!'})
        }
        const findedComments = await commentModel.findAll({
            attributes: ['id', 'author', 'text', 'date_time'],
            where: {
                post: post
            }
        })
        if (findedComments[0] === undefined){
            return res.status(statusErr.code).json({message: 'This post haven\'t comments!'})
        }
        return res.status(statusOK.code).json(findedComments)
    } catch (e){
        console.log(e.message)
        return res.status(statusErr.code).json({message: e.message})
    }
}

module.exports.deleteComment = async (req, res) => {
    try {
        const {id} = req.body
        const {token} = req.headers
        const author = Object(await checkToken(token)).id
        if (!author) {
            return res.status(statusErr.code).json({message: 'You are not authorizated!'})
        }
        const findedComment = await commentModel.findOne({
            attributes: ['id', 'author'],
            where: {
                id: id,
            }
        })
        if (findedComment === null){
            return res.status(statusErr.code).json({message: 'This comment not exists!'})
        }
        if (findedComment.author != author){
            return res.status(statusErr.code).json({message: 'You haven\'t access to this comment!'})
        }
        findedComment.destroy()
        return res.status(statusOK.code).json({message: 'Comment deleted!'})
    } catch (e){
        console.log(e.message)
        return res.status(statusErr.code).json({message: e.message})
    }
}

async function existPost(id) {
    const findedPost = await postModel.findOne({
        where: {
            id: id
        }
    })
    return findedPost === null
}
async function checkToken(token) {
    try {
        const response = await axios.post(process.env.REGISTRATION_SERVICE + process.env.AUTHORIZATION, {}, {
                headers: {authorization: token}
            }
        )
        return response.data
    } catch (e) {
        return e
    }
}