const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'hinduvahini_super_secret_key_2024';

const { query } = require('../config/db');

// @route   POST /api/admin/login
// @desc    Authenticate admin and return JWT
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const [rows] = await query('SELECT * FROM admins WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, name: admin.name },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                avatar: admin.avatar
            }
        });

    } catch (error) {
        console.error('Admin login error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   GET /api/admin/me
// @desc    Get currently authenticated admin profile
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const [rows] = await query(
            'SELECT id, name, email, phone, avatar, created_at FROM admins WHERE id = ?',
            [req.admin.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Admin not found.' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Admin me error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   PUT /api/admin/profile
// @desc    Update admin profile (name, phone, avatar)
router.put('/profile', authMiddleware, async (req, res) => {
    const { name, phone } = req.body;

    try {
        await query(
            'UPDATE admins SET name = ?, phone = ? WHERE id = ?',
            [name, phone, req.admin.id]
        );
        res.json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Admin profile update error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   PUT /api/admin/change-password
// @desc    Change admin password securely
router.put('/change-password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new password are required.' });
    }

    try {
        const [rows] = await query('SELECT password FROM admins WHERE id = ?', [req.admin.id]);
        const isMatch = await bcrypt.compare(currentPassword, rows[0].password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect.' });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await query('UPDATE admins SET password = ? WHERE id = ?', [hashed, req.admin.id]);

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Admin change-password error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   GET /api/admin/queries
// @desc    Get all contact inquiries
router.get('/queries', authMiddleware, async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM inquiries ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Admin queries error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   PUT /api/admin/queries/:id/status
// @desc    Update status of a contact inquiry
router.put('/queries/:id/status', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Reviewed', 'Resolved'].includes(status)) {
        return res.status(400).json({ error: 'Valid status is required.' });
    }

    try {
        const [result] = await query('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Inquiry not found.' });
        }

        res.json({ message: 'Status updated successfully.', status });
    } catch (error) {
        console.error('Admin update query status error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
