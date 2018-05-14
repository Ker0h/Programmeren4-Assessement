const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const auth = require('../auth/authentication.js');
const studentenhuis = require('../routes/studentenhuis.js');

//
// Login with {"username":"<username>", "password":"<password>"}
//
router.route('/login')

    .post( function(req, res) {

        //
        // Get body params or ''
        //
        var username = req.body.username || '';
        var password = req.body.password || '';

        //
        // Check in datasource for user & password combo.
        //
        //
        var result = "";
        result = users.filter(function (user) {
            if( user.username === username && user.password === password) {
                return ( user );
            }
        });

        // Debug
        console.log("result: " +  JSON.stringify(result[0]));

        // Generate JWT
        if( result[0] ) {
            res.status(200).json({"token" : auth.encodeToken(username), "username" : username});
        } else {
            res.status(401).json({"error":"Invalid credentials, bye"})
        }

});


module.exports = router;