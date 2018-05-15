var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "studentenhuis_user",
    password: process.env.DB_PASSWORD || "secret",
    database: process.env.DB_DATABASE || "studentenhuis"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = con;