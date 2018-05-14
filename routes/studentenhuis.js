const express = require('express');
const router = express.Router();
const auth =  require('../auth/authentication');
const db = require('../datasource/dbCon');

router.post('/studentenhuis', function(req, res, next){

});


router.get('/studentenhuis', function(req, res) {
    let result = [];
        result = db.query("SELECT * FROM studentenhuis", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
        });
    res.json(result);
});


router.get('/studentenhuis/:huisId?', function(req, res) {

    const huisId = req.params.huisId || '';
    let result = [];

    if( huisId ) {
        console.log('huisId');
        db.query("SELECT * from `studentenhuis` WHERE `ID` = " + huisId + ";", function (err, result, fields){
            if (err) throw err;
            console.log(result);
        })
    } else {
        result = db;
    }

    res.json(result);
});


module.exports = router;