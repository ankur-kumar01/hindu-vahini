const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'hinduvahini_super_secret_key_2024';

const { query } = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});

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

// ==============================
// CMS ROUTES (Leaders & Gallery)
// ==============================

// @route   POST /api/admin/leaders
router.post('/leaders', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, role, designation, bio, phone, display_order } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;
        
        await query(
            'INSERT INTO leaders (name, role, designation, bio, image_url, phone, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, role, designation, bio, image_url, phone, display_order || 0]
        );
        res.status(201).json({ message: 'Leader added successfully.' });
    } catch (error) {
        console.error('Add leader error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   PUT /api/admin/leaders/:id
router.put('/leaders/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, role, designation, bio, phone, display_order } = req.body;
        const { id } = req.params;
        
        let sql = 'UPDATE leaders SET name=?, role=?, designation=?, bio=?, phone=?, display_order=? WHERE id=?';
        let params = [name, role, designation, bio, phone, display_order || 0, id];

        if (req.file) {
            const image_url = `/uploads/${req.file.filename}`;
            sql = 'UPDATE leaders SET name=?, role=?, designation=?, bio=?, phone=?, display_order=?, image_url=? WHERE id=?';
            params = [name, role, designation, bio, phone, display_order || 0, image_url, id];
        }

        await query(sql, params);
        res.json({ message: 'Leader updated successfully.' });
    } catch (error) {
        console.error('Update leader error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   DELETE /api/admin/leaders/:id
router.delete('/leaders/:id', authMiddleware, async (req, res) => {
    try {
        await query('DELETE FROM leaders WHERE id=?', [req.params.id]);
        res.json({ message: 'Leader deleted successfully.' });
    } catch (error) {
        console.error('Delete leader error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   POST /api/admin/gallery
router.post('/gallery', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { span_classes, display_order } = req.body;
        
        if (!req.file) return res.status(400).json({ error: 'Image file is required.' });
        
        const image_url = `/uploads/${req.file.filename}`;
        
        await query(
            'INSERT INTO gallery_images (image_url, span_classes, display_order) VALUES (?, ?, ?)',
            [image_url, span_classes || 'row-span-1 col-span-1', display_order || 0]
        );
        res.status(201).json({ message: 'Image added successfully.' });
    } catch (error) {
        console.error('Add gallery error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   DELETE /api/admin/gallery/:id
router.delete('/gallery/:id', authMiddleware, async (req, res) => {
    try {
        await query('DELETE FROM gallery_images WHERE id=?', [req.params.id]);
        res.json({ message: 'Image deleted successfully.' });
    } catch (error) {
        console.error('Delete gallery error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
