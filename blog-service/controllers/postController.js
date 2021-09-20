const postModel = require('../connection').post
const statusOK = {code: 200, description: 'OK'}
const statusErr = {code: 400, description: 'Bad Request'}
const axios = require('axios')

module.exports.createPost = async (req, res) => {
    try {

        const {title, text, attachments} = req.body
        const {token} = req.headers
        const author = Object(await checkToken(token)).id
        if (author == null) {
            return res.status(statusErr.code).json({message: "You are not authorizated!"})
        }
        postModel.create({
            author: author,
            title: title,
            text: text,
            attachments: attachments,
            date_time: Date.now()
        })
        return res.status(statusOK.code).json({message: 'Posted!'})
    } catch (e) {
        return res.status(statusErr.code).json({message: e.message})
    }
}

module.exports.deletePost = async (req, res) => {
    try {
        const {post} = req.body
        const {token} = req.headers
        const findedPost = await postModel.findOne({
            attributes: ['id', 'author'],
            where: {
                id: post
            }
        })
        if (findedPost === null){
            return res.status(statusErr.code).json({message: 'Post not found!'})
        }
        const author = Object(await checkToken(token)).id
        if (findedPost.author != author){
            return res.status(statusErr.code).json({message: 'You haven\'t access to this post!'})
        }
        findedPost.destroy()
        return res.status(statusOK.code).json({message: 'Post deleted!'})
    } catch (e){
        console.log(e.message)
        return res.status(statusErr.code).json({message: e.message})
    }
}

module.exports.findPost = async (req, res) => {
    try {
        const {post} = req.body
        const findedPost = await postModel.findOne({
            where: {
                id: post
            }
        })
        if (findedPost === null){
            return res.status(statusErr.code).json({message: 'Post not found!'})
        }
        return res.status(statusOK.code).json(findedPost)
    } catch (e){
        console.log(e.message)
        return res.status(statusErr.code).json({message: e.message})
    }
}

module.exports.findAuthorPosts = async (req, res) => {
    try {
        const {author} = req.body
        const findedPost = await postModel.findAll({
            where: {
                author: author
            }
        })
        if (findedPost === null){
            return res.status(statusErr.code).json({message: 'This is author haven\'t posts!'})
        }
        return res.status(statusOK.code).json(findedPost)
    } catch (e){
        console.log(e.message)
        return res.status(statusErr.code).json({message: e.message})
    }
}

async function checkToken(token) {
    try {
        const response = await axios.post(process.env.REGISTRATION_SERVICE + process.env.AUTHORIZATION , {}, {
            headers: {authorization: token}
            }
        )
        console.log('response', response)
        return response.data
    } catch (e) {
        return e
    }
}