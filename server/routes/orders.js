const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all orders (Admin)
router.get('/all', (req, res) => {
    const query = `SELECT * FROM orders`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get tailor orders
router.get('/tailor/:name', (req, res) => {
    const query = `SELECT * FROM orders WHERE tailor = ?`;
    db.query(query, [req.params.name], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get single order (track order)
router.get('/:orderNo', (req, res) => {
    const query = `SELECT * FROM orders WHERE orderNo = ?`;
    db.query(query, [req.params.orderNo], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Order not found' });
        res.json(results[0]);
    });
});

// Add new order (Admin)
router.post('/add', (req, res) => {
    const { orderNo, type, tailor, dueDate, status } = req.body;
    const query = `INSERT INTO orders (orderNo,type,tailor,dueDate,status) VALUES(?,?,?,?,?)`;
    db.query(query, [orderNo, type, tailor, dueDate, status], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order added' });
    });
});

// Update order
router.put('/update/:orderNo', (req, res) => {
    const { type, tailor, dueDate, status } = req.body;
    const query = `UPDATE orders SET type=?, tailor=?, dueDate=?, status=? WHERE orderNo=?`;
    db.query(query, [type, tailor, dueDate, status, req.params.orderNo], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order updated' });
    });
});

// Delete order (Admin)
router.delete('/delete/:orderNo', (req, res) => {
    const query = `DELETE FROM orders WHERE orderNo=?`;
    db.query(query, [req.params.orderNo], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Order deleted' });
    });
});

module.exports = router;
