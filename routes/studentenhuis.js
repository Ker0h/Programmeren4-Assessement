const express = require('express');
const router = express.Router();
const db = require('../datasource/dbCon');

router.post('/', function(req, res){

    let naam = req.body.naam || '';
    let adres = req.body.adres || '';
    db.query("INSERT INTO `studentenhuis` (Naam, Adres, UserID) VALUES ('" + naam + "', '" + adres + "', 1);", function (err ,rows, fields) {
        if (err) throw err;
        //res.json(result);
        var row = rows.insertId;
        db.query("SELECT * FROM studentenhuis WHERE ID = "  + row + ";", function (err, result){
            if (err) {
                res.status(404).json({
                    "msg": "Niet gevonden (huisId bestaat niet)",
                    "parameters": res.body
                })
            }
            res.json(result);
        });
    });

});


router.get('/', function(req, res) {
        db.query("SELECT * FROM studentenhuis", function (err, result) {
            if (err) throw err;
            res.json(result)
        });
});


router.get('/:huisId?', function(req, res) {
    const huisId = req.params.huisId || '';

    if( huisId ) {
        db.query("SELECT * FROM studentenhuis WHERE ID = "  + huisId + ";", function (err, result){
            if (err) {
                res.status(404).json({
                    "msg": "Niet gevonden (huisId bestaat niet)",
                    "parameters": res.body
                })
            }
            res.json(result);

        })
    } else {
        res.status(404).json({
            "msg" : "Niet gevonden (huisId bestaat niet)",
            "parameters" : res.body
        })
    }
});


module.exports = router;