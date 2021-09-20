const express = require('express')
const router = express.Router()
const {header, body, validationResult} = require('express-validator')
const statusErr = {code: 400, description: 'Bad Request'}
const {
    sendMessage, getChatList, getMessages, readMessage
} = require('./controllers/messagesController')

router.post('/api/message/sendMessage',
    header('token', 'Token is not a JWT')
        .isJWT(),
    body('text', 'Text field is null!')
        .notEmpty(),
    body('receiver', 'Receiver is not a numeric!')
        .isNumeric(),
    middleCheckErrors,
    function (req, res) {
        return sendMessage(req, res)
    })

router.post('/api/message/getMessages',
    body('receiver', 'Receiver is not a numeric')
        .isNumeric(),
    header('token', 'Token is not a JWT')
        .isJWT(),
    middleCheckErrors,
    function (req, res) {
        return getMessages(req, res)
    })

router.post('/api/message/getChatList',
    header('token', 'Token is not a JWT')
        .isJWT(),
    middleCheckErrors,
    function (req, res) {
        return getChatList(req, res)
    })

router.post('/api/message/readMessage',
    body('id', 'id message field not a numeric!')
        .isNumeric(),
    header('token', 'Token field not a JWT!')
        .isJWT(),
    middleCheckErrors,
    function (req, res) {
        return readMessage(req, res)
    })

function middleCheckErrors(req, res, next){
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(statusErr.code).json({errors: errors.array()})
    }
    next()
}

module.exports = router