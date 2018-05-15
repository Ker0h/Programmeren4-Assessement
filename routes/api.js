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

        //
        // Get body params or ''
        //
        let username = req.body.username || '';
        let password = req.body.password || '';

        //
        // Check in datasource for user & password combo.
        //
        //
        db.query('SELECT email, password FROM user WHERE email = ?', [username], function (error, rows, fields) {
            if (error) {
                res.status(500).json(error)
            }

            console.log(rows)

            if (username == rows[0].email && password == rows[0].password) {
                var token = auth.encodeToken(username);
                res.status(200).json({
                    "token": token,
                    "status": 200,
                    "parameters": res.body
                });
            } else {
                error.notAuthorized(res)
            }
        })
});

router.route('/register').post( function(req, res){
    let firstname = req.body.firstname || '';
    let lastname = req.body.lastname || '';
    let email = req.body.email || '';
    let password = req.body.password || '';
    if (firstname !== '' && lastname !== '' && email !== '' && password !== '') {
        if (regex.test(email) === true) {
            db.query("SELECT Email FROM user WHERE Email = ?", [email], function(err, result) {
                if(result.length > 0){
                    error.emailTaken(res)
                }
                else{
                    db.query("INSERT INTO `user` (Voornaam, Achternaam, Email, Password) VALUES (?, ?, ?, ?)" ,[firstname, lastname, email, password], function(err, result) {
                        console.log(result);
                        db.query("SELECT Voornaam, Achternaam, Email FROM user WHERE Email = ?",[email], function(err, result) {
                            if (err) throw err;
                            res.json(result)})
                    })
                    let token = auth.encodeToken(email)
                }
            })
        }
        else{
            error.emailInvalid(res)
        }
    }
    else{
        error.missingProp(res)
    }
});

router.use('/studentenhuis', studentenhuis)

module.exports = router;