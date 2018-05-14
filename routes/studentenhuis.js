const express = require('express');
const router = express.Router();
const auth =  require('../auth/authentication');
const db = require('../datasource/dbCon');


router.get('/studentenhuis', function(req, res, next) {
    let result = [];
        result = db.query("SELECT * FROM studentenhuis", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    res.json(result);
});


router.get('/studentenhuis/:huisId?', function(req, res, next) {

    const huisId = req.params.huisId || '';
    let result = [];

    if( huisId ) {
        console.log('huisId');
        db.query();
    } else {
        result = db;
    }

    res.json(result);
});


module.exports = router;