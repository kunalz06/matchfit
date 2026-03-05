const db = require('./db');

// Add orderDate column
const alterQuery = `ALTER TABLE orders ADD COLUMN orderDate DATETIME DEFAULT CURRENT_TIMESTAMP`;

db.query(alterQuery, (err, results) => {
    if (err) {
        // Ignore if column already exists
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('orderDate column already exists.');
        } else {
            console.error('Error altering table:', err.message);
        }
    } else {
        console.log('Successfully added orderDate column to orders table.');
    }
    process.exit(0);
});
