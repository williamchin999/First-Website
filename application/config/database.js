// get the client
const mysql = require('mysql2');

// create the connection to database
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'csc317db',
  password: '1234'
});

module.exports = db.promise();
