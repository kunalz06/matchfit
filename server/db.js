const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // replace with your MySQL username
    password: 'kunal',     // replace with your MySQL password
    database: 'matchfit'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

module.exports = db;