const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const util = require('util');

// Promisify db.query
const dbQuery = util.promisify(db.query).bind(db);

// Admin login (username + password)
router.post('/admin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const results = await dbQuery('SELECT * FROM admin_users WHERE username = ?', [username]);
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, results[0].password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Admin logged in' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Tailor login (password only)
router.post('/tailor', async (req, res) => {
    const { password } = req.body;
    try {
        const results = await dbQuery('SELECT * FROM tailors');
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let matchedTailor = null;
        for (let tailor of results) {
            const match = await bcrypt.compare(password, tailor.password);
            if (match) {
                matchedTailor = tailor;
                break;
            }
        }

        if (!matchedTailor) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Tailor logged in', tailorName: matchedTailor.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all tailors (for dropdown + management)
router.get('/tailors', async (req, res) => {
    try {
        const results = await dbQuery('SELECT id, name FROM tailors');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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

        await dbQuery(query, [name, hashedPassword]);
        res.json({ message: 'Tailor added successfully' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Tailor name already exists' });
        }
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
        let query;
        let params;
        // If password is provided, hash it and update both name + password
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = 'UPDATE tailors SET name = ?, password = ? WHERE id = ?';
            params = [name, hashedPassword, id];
        } else {
            // Only update name
            query = 'UPDATE tailors SET name = ? WHERE id = ?';
            params = [name, id];
        }
        await dbQuery(query, params);
        res.json({ message: 'Tailor updated successfully' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Tailor name already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Delete tailor (Admin only)
router.delete('/delete-tailor/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await dbQuery('DELETE FROM tailors WHERE id = ?', [id]);
        res.json({ message: 'Tailor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;