const express = require('express');
const router = express.Router();
const db = require('../datasource/dbCon');

router.post('/', function(req, res, next){

});


router.get('/', function(req, res) {
    let result = [];
        result = db.query("SELECT * FROM studentenhuis", function (err, result) {
            if (err) throw err;
            res.json(result)
        });
});


router.get('/:huisId?', function(req, res) {

    const huisId = req.params.huisId || '';
    let result = [];

    if( huisId ) {
        db.query("SELECT * from `studentenhuis` WHERE `ID` = " + huisId + ";", function (err, result){
            if (err) {
                res.status(404).json({
                    "msg": "Niet gevonden (huisId bestaat niet)",
                    "parameters": res.body
                })
            }
            console.log(result);
        })
    } else {
        result = db;
    }

    res.json(result);
});


module.exports = router;