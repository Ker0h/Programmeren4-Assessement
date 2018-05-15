const express = require('express')
const router = express.Router({mergeParams: true})
const deelnemers = require('./deelnemers')
const db = require('../datasource/dbCon');
const format = require('node.date-time');
const error = require('../Errorhandling/Errorcodes')
const auth = require('../auth/authentication')
const studentenhuis = require('./studentenhuis')


router.post('/', (req, res) => {
    let HouseId = req.params.huisId || '';
    let Name = req.body.naam || '';
    let Desc = req.body.Beschrijving || '';
    let Ingredients = req.body.Ingredienten || '';
    let Allergies = req.body.Allergie || '';
    let Price = req.body.Prijs || '';

    let token = req.get('Authorization')
    token = token.substring(7)
    let email = auth.decodeToken(token)
    email = email.sub

    if (Name !== '' && Desc !== '' && Ingredients !== '' && Allergies !== '' && Price !== '') {
        db.query("SELECT ID FROM user WHERE email = ?", [email], function (err, rows, fields) {
            let userId = rows[0].ID

            checkId(HouseId, res)
                db.query("INSERT INTO `maaltijd` (Naam, Beschrijving, Ingredienten, Allergie, Prijs, UserID, StudentenhuisID) VALUES (?, ?, ?, ?, ?, ?, ?)", [Name, Desc, Ingredients, Allergies, Price, userId, HouseId], function (err, rows, fields) {
                    if (err) throw err;
                    db.query("SELECT Naam, Beschrijving, Ingredienten, Allergie, Prijs FROM `maaltijd` WHERE Naam = ? AND StudentenhuisID = ?", [Name, HouseId], function (err, result, ){
                        if (err) throw err;
                        res.json(result)
                    })
                });
        })
    } else {
        error.missingProp(res)
    }
});

router.get('/', (req, res)=> {
    let HouseId = req.params.huisId || '';
    console.log(HouseId)
    checkId(HouseId, res)
    db.query("SELECT ID, Naam, Beschrijving, Ingredienten, Allergie, Prijs FROM maaltijd WHERE StudentenhuisID = ?", [HouseId], (err, result) => {
        if (result.length > 0) {
            console.log("selectId")
            res.json(result)
        } else {
            error.noResult(res)
        }
    })
})

router.get('/:maaltijdId?', (req, res)=> {
    let HouseId = req.params.huisId || '';
    checkId(HouseId, res)
    let maaltijdId = req.params.maaltijdId || '';
    db.query("SELECT ID, Naam, Beschrijving, Ingredienten, Allergie, Prijs FROM maaltijd WHERE ID = ? AND StudentenhuisID = ?", [maaltijdId, HouseId], (err, result) => {
        if (result.length > 0) {
            console.log("selectId")
            res.json(result)
        } else {
            error.notFound(res)
        }
    })
})

router.put('/:maaltijdId', (req, res) => {
    let maaltijdId = req.params.maaltijdId || '';
    let houseId = req.params.huisId || '';
    let Name = req.body.naam || '';
    let Desc = req.body.Beschrijving || '';
    let Ingredients = req.body.Ingredienten || '';
    let Allergies = req.body.Allergie || '';
    let Price = req.body.Prijs || '';

    let token = req.get('Authorization')
    token = token.substring(7)
    let email = auth.decodeToken(token)
    email = email.sub

    if (Name !== '' && Desc !== '' && Ingredients !== '' && Allergies !== '' && Price !== '') {
        //Get Current user ID
        db.query("SELECT ID FROM user WHERE Email = ?", [email], function (err, rows) {
            let currentUserId = rows[0].ID

            //Get existing user ID
            checkId(houseId, res)
            db.query("SELECT UserID FROM maaltijd WHERE ID = ?", [maaltijdId], function (err, rows) {
                let existingUserId = rows[0].UserID

                if (currentUserId === existingUserId) {
                    db.query("UPDATE maaltijd SET Naam = ?, Beschrijving = ?, Ingredienten = ?, Allergie = ?, Prijs = ? WHERE ID = ?", [Name, Desc, Ingredients, Allergies, Price, maaltijdId], function (err, result) {
                        console.log(result)
                        db.query("SELECT ID, Naam, Beschrijving, Ingredienten, Allergie, Prijs FROM maaltijd WHERE ID = ? ", [maaltijdId], (err, result) => {
                                res.json(result)
                        })
                    })
                }else{
                    error.InsufficientRights(res)
                }
            })
        })
    } else {
        error.missingProp(res)
    }
});

router.delete()


function checkId(houseId, res) {
    db.query("SELECT * FROM studentenhuis WHERE ID = ?", [houseId], (err, result) => {
        if (result.length > 0) {
            console.log("selectId")
        } else {
            error.notFound(res)
        }
    })
}



router.use('/:maaltijdId/deelnemers', deelnemers)

module.exports = router