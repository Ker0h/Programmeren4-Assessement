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

    console.log(huisId + "huisid");
    let result = [];

    if( huisId ) {
        result = db.query("SELECT * FROM studentenhuis WHERE ID = "  + huisId + ";", function (err, result){
            if (err) {
                res.status(404).json({
                    "msg": "Niet gevonden (huisId bestaat niet)",
                    "parameters": res.body
                })
            }
            res.json(result);
            console.log(res);


        })
    } else {
        res = db;
    }


});


module.exports = router;