const express = require('express');
const router = express.Router();
const db = require('../datasource/dbCon');
var dateTime = require('node.date-time');

try {
    router.post('/', (req, res) => {

        let naam = req.body.naam || '';
        let adres = req.body.adres || '';
        db.query("INSERT INTO `studentenhuis` (Naam, Adres, UserID) VALUES ('" + naam + "', '" + adres + "', 1);", function (err, rows, fields) {
            if (err) throw err;
            var row = rows.insertId;
            db.query("SELECT * FROM studentenhuis WHERE ID = " + row + ";", function (err, result) {
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


    router.get('/', (req, res) => {
        db.query("SELECT * FROM studentenhuis", function (err, result) {
            if (err) throw err;
            res.json(result)
        });
    });


    router.get('/:huisId?', (req, res) => {
        const huisId = req.params.huisId || '';

        if (huisId) {
            db.query("SELECT * FROM studentenhuis WHERE ID = " + huisId + ";", function (err, result) {
                if (err) {

                    res.status(404).json({
                        "msg": "Niet gevonden (huisId bestaat niet)",
                        "parameters": res.body,
                        "datetime": new Date().format("d-M-Y H:m:s")
                    })
                }
                res.json(result);

            })
        }
    });

    router.put('/:huisId?', (req, res) => {
        const huisId = req.params.huisId || '';
        let naam = req.body.naam || '';
        let adres = req.body.adres || '';
        if (huisId && naam !== '' && adres !== '') {
            db.query("REPLACE INTO studentenhuis VALUES (" + huisId + ", '" + naam + "', '" + adres + "', 1);", function (err, result) {
                if (err) {
                    res.status(404).json({
                        "msg": "Niet gevonden (huisId bestaat niet)",
                        "parameters": res.body,
                        "datetime": new Date().format("d-M-Y H:m:s")
                    })
                }
                db.query("SELECT * FROM studentenhuis WHERE ID = " + huisId + ";", function (err, result) {
                    res.json(result);
                })
            })
        }
        else {
            res.status(412).json({
                "msg": "Een of meer properties in de request body ontbreken of zijn foutief",
                "code": 412,
                "datetime": new Date().format("d-M-Y H:m:s")
            })
        }

    });
}
catch (UnauthorizedError){
    res.status(401).json({
        "msg": "Niet geautoriseerd (geen valid token)",
        "code": 401,
        "datetime": new Date().format("d-M-Y H:m:s")
    })
}

module.exports = router;