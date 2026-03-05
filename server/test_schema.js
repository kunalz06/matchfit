const db = require('./db');

db.query('DESCRIBE orders', (err, results) => {
    if (err) {
        console.error(err);
    } else {
        console.log(results.map(r => r.Field));
    }
    process.exit(0);
});
