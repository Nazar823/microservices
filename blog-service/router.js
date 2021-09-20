const express = require('express')
const router = express.Router()
const {header, body, validationResult, oneOf} = require('express-validator')
const statusErr = {code: 400, description: 'Bad Request'}
const {
    createComment, findCommentsByPost, deleteComment
} = require('./controllers/commentController')

router.post('/api/blog/createComment',
    header('token', 'Token is not a JWT')
        .isJWT(),
    body('text', 'Text field is null!')
        .notEmpty(),
    body('post', 'Post is not a numeric!')
        .isNumeric(),
    middleCheckErrors,
    function (req, res) {
        return createComment(req, res)
    })
router.post('/api/blog/findComments',
    body('post', 'Post is not a numeric')
        .isNumeric(),
    middleCheckErrors,
    function (req, res) {
        return findCommentsByPost(req, res)
    })
router.post('/api/blog/deleteComment',
    body('id', 'Id is not a numeric')
        .isNumeric(),
    header('token', 'Token is not a JWT')
        .isJWT(),
    middleCheckErrors,
    function (req, res) {
        return deleteComment(req, res)
    })
const {
    createPost, deletePost, findPost, findAuthorPosts
} =  require('./controllers/postController')

router.post('/api/blog/deletePost',
    body('post', 'Post field not a numeric!')
        .isNumeric(),
    header('token', 'Token field not a JWT!')
        .isJWT(),
    middleCheckErrors,
    function (req, res) {
        return deletePost(req, res)
    })
router.post('/api/blog/createPost',
    body('title', 'Title field null!')
        .notEmpty(),
    header('token', 'Token field not is JWT!')
        .isJWT(),
    body('text', 'Text field null!')
        .notEmpty(),
    oneOf([
        body('attachments', 'Attachments must be null or link')
            .isURL(),
        body('attachments', 'Attachments must be null or link')
            .isEmpty()]),
    middleCheckErrors,
    function (req, res) {
        return createPost(req, res)
    })
router.post('/api/blog/findPost',
    body('post', 'Post field not a numeric!')
        .isNumeric(),
    middleCheckErrors,
    function (req, res) {
        return findPost(req, res)
    })
router.post('/api/blog/findAuthorPosts',
    body('author', 'Author field not a numeric!')
        .isNumeric(),
    middleCheckErrors,
    function (req, res) {
        return findAuthorPosts(req, res)
    })

function middleCheckErrors(req, res, next){
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(statusErr.code).json({errors: errors.array()})
    }
    next()
}
module.exports = router