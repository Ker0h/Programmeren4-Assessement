const express = require('express');
const router = express.Router();
const db = require('../datasource/dbCon');
const format = require('node.date-time');
const error = require('../Errorhandling/Errorcodes')


    router.post('/', (req, res) => {

        let naam = req.body.naam || '';
        let adres = req.body.adres || '';
        if (naam !== '' && adres !== '') {
            db.query("INSERT INTO `studentenhuis` (Naam, Adres, UserID) VALUES ('" + naam + "', '" + adres + "', 1);", function (err, rows, fields) {
                if (err) throw err;
                let row = rows.insertId;
                selectId(row, res)
            });
        }
        else {
            error.missingProp(res)
        }

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
            selectId(huisId, res)
        }
    });

    router.put('/:huisId?', (req, res) => {
        const huisId = req.params.huisId || '';
        let naam = req.body.naam || '';
        let adres = req.body.adres || '';
        let row
        if (huisId && naam !== '' && adres !== '') {
            db.query("SELECT UserID FROM studentenhuis WHERE ID = " + huisId + ";", function (err, rows) {
                if (rows = '') {
                    error.notFound(res)
                }
                row = rows.insertId;
            })
            if (row = 1) {
                db.query("REPLACE INTO studentenhuis VALUES (" + huisId + ", '" + naam + "', '" + adres + "', 1);", function (err, result) {
                    selectId(huisId, res)
                })
            }
            else {
                error.conflict(res)
            }
        }
        else {
            error.missingProp(res)
        }
    });


function selectId(huisId, res) {
    db.query("SELECT * FROM studentenhuis WHERE ID = " + huisId + ";", function (err, result) {
        if(result.length > 0){
            res.json(result);
        }
        else{
            console.log("test")
            error.notFound(res)
        }
    })
}

module.exports = router;