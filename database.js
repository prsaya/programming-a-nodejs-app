const mysql = require('mysql');

const conn = mysql.createConnection({
	host     : 'localhost',
	port     : 3306,
	user     : 'root',
	password : 'root',
	database : 'test_db'
});

conn.connect(error => {
	if (error) throw error;
	console.log('Connected to database.');
});

module.exports = conn;