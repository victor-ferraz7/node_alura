const mysql = require('mysql');

function createDBConnection(){ 
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'VictorFerraz',
        database: 'payfast'
    });
}

module.exports = function(){
    return createDBConnection;
}