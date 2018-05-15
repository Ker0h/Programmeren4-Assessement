const express = require('express')
const expressJWT = require('express-jwt')
const bodyParser = require('body-parser')
const api = require('./routes/api.js')
const config = require('./config.js')
const format = require('node.date-time');
const error = require('./Errorhandling/Errorcodes')


let app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(expressJWT({
    secret: config.secretkey
}).unless({
    path: ['/api/login', '/api/register']
}));

app.use(function(err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
        error.notAuthorized(res)
        return;
    }
    next();
});

app.use('/api', api);

app.listen(config.port);

module.exports = app