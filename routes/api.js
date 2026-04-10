const express = require('express');
const router = express.Namespace ? express.Namespace() : express.Router();
const { query } = require('../config/db');

// @route   POST /api/members
// @desc    Register a new member
router.post('/members', async (req, res) => {
    const { name, email, phone, city, interests, message } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and Email are required.' });
    }

    try {
        const sql = 'INSERT INTO members (name, email, phone, city, interests, message) VALUES (?, ?, ?, ?, ?, ?)';
        await query(sql, [name, email, phone, city, interests, message]);
        
        res.status(201).json({ message: 'Membership application submitted successfully!' });
    } catch (error) {
        console.error('API Error (Members):', error.message);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

// @route   POST /api/contact
// @desc    Submit a contact inquiry
router.post('/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, Email, and Message are required.' });
    }

    try {
        const sql = 'INSERT INTO inquiries (name, email, subject, message) VALUES (?, ?, ?, ?)';
        await query(sql, [name, email, subject, message]);
        
        res.status(201).json({ message: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('API Error (Contact):', error.message);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

module.exports = router;
