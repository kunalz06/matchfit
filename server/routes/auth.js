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
            const match = await bcrypt.compare(password, tailor.password);
            if (match || password === tailor.password) {
                matchedTailor = tailor;
                break;
            }
        }

        if (!matchedTailor) return res.status(401).json({ message: 'Invalid credentials' });

        res.json({ message: 'Tailor logged in', tailorName: matchedTailor.name });
    });
});

// Get all tailors (for dropdown + management)
router.get('/tailors', (req, res) => {
    db.query('SELECT id, name FROM tailors', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Add new tailor (Admin only)
router.post('/add-tailor', async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ message: 'Name and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO tailors (name, password) VALUES (?, ?)';

        db.query(query, [name, hashedPassword], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Tailor name already exists' });
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Tailor added successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update tailor (Admin only)
router.put('/update-tailor/:id', async (req, res) => {
    const { name, password } = req.body;
    const { id } = req.params;

    if (!name) {
        return res.status(400).json({ message: 'Tailor name is required' });
    }

    try {
        // If password is provided, hash it and update both name + password
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('UPDATE tailors SET name = ?, password = ? WHERE id = ?', [name, hashedPassword, id], (err) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Tailor name already exists' });
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: 'Tailor updated successfully' });
            });
        } else {
            // Only update name
            db.query('UPDATE tailors SET name = ? WHERE id = ?', [name, id], (err) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Tailor name already exists' });
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: 'Tailor updated successfully' });
            });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete tailor (Admin only)
router.delete('/delete-tailor/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tailors WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Tailor deleted successfully' });
    });
});

module.exports = router;