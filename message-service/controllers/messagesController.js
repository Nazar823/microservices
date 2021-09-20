const axios = require('axios')
const {Op} = require('sequelize');
const messageModel = require('../connection').message
const statusOK = {code: 200, description: 'OK'}
const statusErr = {code: 400, description: 'Bad Request'}

module.exports.sendMessage = async (req, res) => {
    try {
        const {receiver, text} = req.body
        const sender = Object(await checkToken(req.headers.token)).id
        if (!sender) {
            return res.status(statusErr.code).json({message: 'You not authorized!'})
        }
        const userName = await getUserName(receiver)
        if (!userName){
            return res.status(statusErr.code).json({message: 'This user not exists!'})
        }
        messageModel.create({
            sender: sender,
            receiver: receiver,
            text: text,
            date_time: Date.now(),
            read: false
        })
        return res.status(statusOK.code).json({message: 'Message sent!'})
    } catch (e) {
        return res.status(statusErr.code).json({message: e.message})
    }
}

module.exports.getMessages = async (req, res) => {
    try {
        const {receiver} = req.body
        const {token} = req.headers
        const sender = Object(await checkToken(token)).id
        if (!sender) {
            return res.status(statusErr.code).json({message: 'You are not authorized!'})
        }
        if (await existChat(sender, receiver)){
            return res.status(statusErr.code).json({message: 'This chat not found!'})
        }
        const findedMessages = await messageModel.findAll({
            attributes: ['id', 'read', 'text', 'date_time'],
            where: {
                [Op.or]: [
                    {[Op.and]: [{sender: sender}, {receiver: receiver}]},
                    {[Op.and]: [{sender: receiver}, {receiver: sender}]}
                ]
            }
        })
        if (findedMessages[0] === undefined){
            return res.status(statusErr.code).json({message: 'This chat haven\'t messages!'})
        }
        return res.status(statusOK.code).json(findedMessages)
    } catch (e){
        console.log(e.message)
        return res.status(statusErr.code).json({message: e.message})
    }
}

module.exports.getChatList = async (req, res) => {
    try {
        const {token} = req.headers
        const sender = Object(await checkToken(token)).id
        if (!sender) {
            return res.status(statusErr.code).json({message: 'You are not authorized!'})
        }
        const findedChats = await messageModel.findAll({
            attributes: ['receiver'],
            where: {
                sender: sender
            },
            group: ['message.receiver']
        })
        if (findedChats[0] === undefined){
            return res.status(statusErr.code).json({message: 'You haven\'t chats!'})
        }
        return res.status(statusOK.code).json(findedChats)
    } catch (e){
        console.log(e.message)
        return res.status(statusErr.code).json({message: e.message})
    }
}

module.exports.readMessage = async (req, res) => {
    try {
        const {id} = req.body
        const {token} = req.headers
        const sender = Object(await checkToken(token)).id
        if (!sender) {
            return res.status(statusErr.code).json({message: 'You are not authorized!'})
        }
        const findedMessage = await messageModel.update({read: true}, {
            where: {
                [Op.and]: [{id: id}, {receiver: sender}]
            }
        })
        if (findedMessage[0] === 0){
            return res.status(statusErr.code).json({message: 'You can\'t read this message!'})
        }
        return res.status(statusOK.code).json({message: 'This message checked as readied!'})
    } catch (e){
        console.log(e.message)
        return res.status(statusErr.code).json({message: e.message})
    }
}

async function existChat(sender, receiver) {
    try {
        const findedChat = await messageModel.findOne({
            where: {
                sender: sender,
                receiver: receiver
            }
        })
        return findedChat === null
    } catch (e){
        return e
    }
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
async function getUserName(user) {
    try {
        const response = await axios.post(process.env.REGISTRATION_SERVICE + process.env.GET_USERNAME, {user: user})
        if (response.status === 200){
            return response.data.name
        }
    } catch (e) {
        return false
    }
}