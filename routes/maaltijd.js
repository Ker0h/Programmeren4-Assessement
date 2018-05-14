const express = require('express')
const router = express.Router()
const deelnemers = require('./deelnemers')
const db = require('../datasource/dbCon');
const format = require('node.date-time');
const error = require('../Errorhandling/Errorcodes')
const auth = require('../auth/authentication')

router.use('/:maaltijdId/deelnemers', deelnemers)

module.exports = router