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
    const { name, email, phone, city, state, country, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, Email, and Message are required.' });
    }

    try {
        const sql = 'INSERT INTO inquiries (name, email, phone, city, state, country, subject, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await query(sql, [
            name, 
            email, 
            phone || null, 
            city || null, 
            state || null, 
            country || 'India', 
            subject || null, 
            message
        ]);
        
        res.status(201).json({ message: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('API Error (Contact):', error.message);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

// @route   GET /api/leaders
// @desc    Get all active leaders ordered by display priority
router.get('/leaders', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM leaders ORDER BY display_order ASC, id ASC');
        res.json(rows);
    } catch (error) {
        console.error('API Error (Leaders):', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   GET /api/gallery
// @desc    Get all gallery images
router.get('/gallery', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM gallery_images ORDER BY display_order ASC, id DESC');
        res.json(rows);
    } catch (error) {
        console.error('API Error (Gallery):', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
