const express = require('express')
const router = express.Router()
const jwt = require('jwt-simple')
const auth = require('../auth/authentication.js')
const studentenhuis = require('./studentenhuis.js')
const db = require('../datasource/dbCon')
const error = require('../Errorhandling/Errorcodes')
let regex = require('regex-email')

//
// Login with {"username":"<username>", "password":"<password>"}
//
router.route('/login').post( function(req, res) {
        let email = req.body.email || '';
        let password = req.body.password || '';

        if(regex.test(email) === true){
            db.query('SELECT email, password FROM user WHERE email = ?', [email], function (err, rows, fields) {
            if (err) {
                res.status(500).json(err)
                return;
            }

            if(rows.length < 1){
                error.notFound(res)
                return;
            }

            if (email == rows[0].email && password == rows[0].password) {
                var token = auth.encodeToken(email);
                res.status(200).json({
                    "token": 'Bearer ' + token,
                    "status": 200,
                    "parameters": res.body
                });
            } else {
                error.notAuthorized(res)
                return;
            }
        })
    }else{
        error.emailInvalid(res)
        return;
    }
});



router.route('/register').post( function(req, res){
    let firstname = req.body.voornaam || '';
    let lastname = req.body.achternaam || '';
    let email = req.body.email || '';
    let password = req.body.password || '';
    
    if (firstname !== '' && lastname !== '' && email !== '' && password !== '') {
        if(firstname.length < 2 || lastname.length < 2){
            error.missingProp(res)
            return;
        }

        if (regex.test(email) === true) {
            db.query("SELECT Email FROM user WHERE Email = ?", [email], function(err, result) {
                if(result.length > 0){
                    error.emailTaken(res)
                    return;
                }else{
                    db.query("INSERT INTO `user` (Voornaam, Achternaam, Email, Password) VALUES (?, ?, ?, ?)" ,[firstname, lastname, email, password], function(err, result) {
                        db.query("SELECT Voornaam, Achternaam, Email FROM user WHERE Email = ?",[email], function(err, result) {
                            if (err) throw err;
                        })
                    })
                    let token = auth.encodeToken(email)
                    res.json({
                        token: token
                    })
                    return;
                }
            })
        }
        else{
            error.emailInvalid(res)
            return;
        }
    }
    else{
        error.missingProp(res)
        return;
    }
});

router.use('/studentenhuis', studentenhuis)

module.exports = router;