var mysql = require('mysql'); 
var con;
exports.connect = function () {
    con = mysql.createPool({
        connectionLimit: 100, 
        host: 'localhost', 
        user: 'root', 
        password: '1234', 
        database: 'webdb'
    });
}

exports.get = function () {
    return con;
};