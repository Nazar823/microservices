require('dotenv').config()
const express = require('express')
const cors = require('cors')
const PORT = process.env.MY_PORT
const apiRoutes = require('./router')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use('/', apiRoutes)

console.log('ENV', process.env.REGISTRATION_SERVICE)

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})
