const express = require('express');
const router = express.Router();
const db = require('../db');
const util = require('util');

// Promisify db.query
const dbQuery = util.promisify(db.query).bind(db);

// Get all orders (Admin)
router.get('/all', async (req, res) => {
    try {
        const query = `SELECT * FROM orders`;
        const results = await dbQuery(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get tailor orders
router.get('/tailor/:name', async (req, res) => {
    try {
        const query = `SELECT * FROM orders WHERE tailor = ?`;
        const results = await dbQuery(query, [req.params.name]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single order (track order)
router.get('/:orderNo', async (req, res) => {
    try {
        const query = `SELECT * FROM orders WHERE orderNo = ?`;
        const results = await dbQuery(query, [req.params.orderNo]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new order (Admin)
router.post('/add', async (req, res) => {
    const { orderNo, type, tailor, dueDate, status } = req.body;
    if (!orderNo || !type || !tailor || !dueDate) {
        return res.status(400).json({ error: 'All fields are required (orderNo, type, tailor, dueDate)' });
    }
    try {
        const query = `INSERT INTO orders (orderNo,type,tailor,dueDate,status) VALUES(?,?,?,?,?)`;
        await dbQuery(query, [orderNo, type, tailor, dueDate, status || 'in progress']);
        res.json({ message: 'Order added' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Order number already exists. Please use a unique order number.' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Update order
router.put('/update/:orderNo', async (req, res) => {
    try {
        const { type, tailor, dueDate, status } = req.body;
        
        // Ensure dueDate is in YYYY-MM-DD format
        let formattedDate = dueDate;
        if (dueDate) {
            const date = new Date(dueDate);
            if (!isNaN(date.getTime())) {
                formattedDate = date.toISOString().split('T')[0];
            }
        }

        const query = `UPDATE orders SET type=?, tailor=?, dueDate=?, status=? WHERE orderNo=?`;
        await dbQuery(query, [type, tailor, formattedDate, status, req.params.orderNo]);
        res.json({ message: 'Order updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete order (Admin)
router.delete('/delete/:orderNo', async (req, res) => {
    try {
        const query = `DELETE FROM orders WHERE orderNo=?`;
        await dbQuery(query, [req.params.orderNo]);
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
