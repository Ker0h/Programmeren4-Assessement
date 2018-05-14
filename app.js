const express = require('express')
const expressJWT = require('express-jwt')
const bodyParser = require('body-parser')
const api = require('./routes/api.js')
const config = require('./config.js')

let app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(expressJWT({
    secret: config.secretkey
}).unless({
    path: ['/api/login']
}))

app.use('/api', api)

app.listen(config.port)