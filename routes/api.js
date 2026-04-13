const express = require('express');
const router = express.Namespace ? express.Namespace() : express.Router();
const { query } = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure proof directory exists
const proofDir = path.join(__dirname, '../uploads/donation_proofs');
if (!fs.existsSync(proofDir)) {
    fs.mkdirSync(proofDir, { recursive: true });
}

// Multer Storage Configuration for Proofs
const storageProof = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, proofDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'proof-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const uploadProof = multer({ 
    storage: storageProof,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});

// @route   POST /api/members
// @desc    Register a new member with payment proof
router.post('/members', uploadProof.single('proof_image'), async (req, res) => {
    const { name, phone, city, state, country, membership_type, amount } = req.body;
    const proof_image_url = req.file ? `/uploads/donation_proofs/${req.file.filename}` : null;

    if (!name || !phone || !membership_type || !amount) {
        return res.status(400).json({ error: 'Name, Phone, Membership Type, and Amount are required.' });
    }

    if (!proof_image_url) {
        return res.status(400).json({ error: 'Please upload a Payment Screenshot as proof of transaction.' });
    }

    try {
        const sql = 'INSERT INTO members (name, phone, city, state, country, membership_type, amount, proof_image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await query(sql, [name, phone, city, state || null, country || 'India', membership_type, amount, proof_image_url, 'pending']);
        
        res.status(201).json({ message: 'Membership application submitted successfully! Pending approval.' });
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

// ==============================
// CAMPAIGNS PUBLIC API
// ==============================

// @route   GET /api/campaigns
router.get('/campaigns', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM campaigns WHERE status = "active" ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Fetch campaigns error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   GET /api/campaigns/:id
router.get('/campaigns/:id', async (req, res) => {
    try {
        const [campaigns] = await query('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);
        if (campaigns.length === 0) return res.status(404).json({ error: 'Campaign not found.' });
        
        const [items] = await query('SELECT * FROM campaign_items WHERE campaign_id = ?', [req.params.id]);
        
        res.json({
            ...campaigns[0],
            items
        });
    } catch (error) {
        console.error('Fetch campaign detail error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   POST /api/campaigns/:id/donate
// @desc    Register a donation intent/pledge (Public)
router.post('/campaigns/:id/donate', async (req, res) => {
    try {
        const { donor_name, amount, transaction_id } = req.body;
        const campaign_id = req.params.id;

        if (!donor_name || !amount) {
            return res.status(400).json({ error: 'Name and amount are required.' });
        }

        await query(
            'INSERT INTO campaign_donations (campaign_id, donor_name, amount, transaction_id, status) VALUES (?, ?, ?, ?, ?)',
            [campaign_id, donor_name, amount, transaction_id || '', 'pending']
        );
        res.status(201).json({ message: 'Donation pledge recorded. Awaiting verification.' });
    } catch (error) {
        console.error('Post donation error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   POST /api/donations/verify
// @desc    Submit payment verification details (Public)
router.post('/donations/verify', uploadProof.single('proof_image'), async (req, res) => {
    try {
        const { donor_name, transaction_id, amount, campaign_id } = req.body;
        const proof_image_url = req.file ? `/uploads/donation_proofs/${req.file.filename}` : null;

        if (!donor_name || !amount) {
            return res.status(400).json({ error: 'Name and amount are required.' });
        }

        if (!proof_image_url) {
            return res.status(400).json({ error: 'Please upload a Payment Screenshot as proof of transaction.' });
        }

        await query(
            'INSERT INTO campaign_donations (campaign_id, donor_name, amount, transaction_id, proof_image_url, status) VALUES (?, ?, ?, ?, ?, ?)',
            [campaign_id || null, donor_name, amount, transaction_id || '', proof_image_url, 'pending']
        );

        res.status(201).json({ message: 'Verification details submitted. Our team will verify and update the status soon.' });
    } catch (error) {
        console.error('Verify donation error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;

