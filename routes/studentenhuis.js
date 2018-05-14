const express = require('express');
const router = express.Router();
const db = require('../datasource/dbCon');
const format = require('node.date-time');
const error = require('../Errorhandling/Errorcodes')
const auth = require('../auth/authentication')

router.post('/', (req, res) => {
    let name = req.body.naam || '';
    let address = req.body.adres || '';

    let token = req.get('Authorization')
    token = token.substring(7)
    let email = auth.decodeToken(token)
    email = email.sub

    if (name !== '' && address !== '') {
        db.query("SELECT ID FROM user WHERE email = ?", [email], function (err, rows, fields) {
            let userId = rows[0].ID

            db.query("INSERT INTO `studentenhuis` (Naam, Adres, UserID) VALUES (?, ?, ?)", [name, address, userId], function (err, rows, fields) {
                if (err) throw err;
                let row = rows.insertId;
                selectId(row, res)
            });
        })
    } else {
        error.missingProp(res)
    }
});

router.get('/', (req, res) => {
    db.query("SELECT * FROM studentenhuis", (err, result) => {
        if (err) throw err;
        res.json(result)
    });
});

router.get('/:huisId?', (req, res) => {
    const houseId = req.params.huisId || '';
    if (houseId) {
        selectId(houseId, res)
    }
});

router.put('/:huisId?', (req, res) => {
    let houseId = req.params.huisId || '';
    let name = req.body.naam || '';
    let address = req.body.adres || '';

    let token = req.get('Authorization')
    token = token.substring(7)
    let email = auth.decodeToken(token)
    email = email.sub

    if (houseId && name !== '' && address !== '') {
        //Get Current user ID
        db.query("SELECT ID FROM user WHERE Email = ?", [email], function (err, rows) {
            let currentUserId = rows[0].ID

            //Get existing user ID
            db.query("SELECT UserID FROM studentenhuis WHERE ID = ?", [houseId], function (err, rows) {
                let existingUserId = rows[0].UserID

                if (currentUserId == existingUserId) {
                    db.query("UPDATE studentenhuis SET naam = ?, adres = ? WHERE ID = ?", [name, address, houseId], function (err, result) {
                        selectId(houseId, res)
                    })
                }else{
                    error.notAuthorized(res)
                }
            })
        })
    } else {
        error.missingProp(res)
    }
});


function selectId(houseId, res) {
    db.query("SELECT * FROM studentenhuis WHERE ID = ?", [houseId], (err, result) => {
        if (result.length > 0) {
            res.json(result);
        } else {
            console.log("test")
            error.notFound(res)
        }
    })
}

module.exports = router;