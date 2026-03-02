const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Admin login (username + password)
router.post('/admin', async (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM admin_users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, results[0].password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({ message: 'Admin logged in' });
    });
});

// Tailor login (password only)
router.post('/tailor', (req, res) => {
    const { password } = req.body;
    db.query('SELECT * FROM tailors', [], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        let matchedTailor = null;
        for (let tailor of results) {
            // Check if password starts with bcrypt signature or compare plain text (to support legacy)
            // But if we want to move to only bcrypt, we use await bcrypt.compare
            const match = await bcrypt.compare(password, tailor.password);

            // To be robust during transition where some might be plaintext
            if (match || password === tailor.password) {
                matchedTailor = tailor;
                break;
            }
        }

        if (!matchedTailor) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({ message: 'Tailor logged in', tailorName: matchedTailor.name });
    });
});

module.exports = router;