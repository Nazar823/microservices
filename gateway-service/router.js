const express = require('express')
const router = express.Router()
const statusErr = {code: 400, description: 'Bad Request'}
const axios = require("axios");
const {getRequests, postRequests} = require("./controller");

router.post('/api/*', postRequests)
router.get('/api/*', getRequests)
module.exports = router