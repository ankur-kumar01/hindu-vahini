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

// Ensure uploads base directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Helper: ensure subfolder exists and return its path
const ensureSubDir = (subFolder) => {
    const dir = path.join(uploadDir, subFolder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
};

// Image file filter (shared)
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed.'));
    }
};

// Leaders Storage → uploads/leaders_img/
const leadersDir = ensureSubDir('leaders_img');
const leadersStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, leadersDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'leader-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: leadersStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFilter
});

// Gallery Storage → uploads/gallery_img/
const galleryDir = ensureSubDir('gallery_img');
const galleryStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, galleryDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const uploadGallery = multer({
    storage: galleryStorage,
    limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
    fileFilter: imageFilter
});

// Campaign Specific Storage
const campaignDir = path.join(uploadDir, 'campaigns');
if (!fs.existsSync(campaignDir)) {
    fs.mkdirSync(campaignDir, { recursive: true });
}

const campaignStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, campaignDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const uploadCampaign = multer({ 
    storage: campaignStorage,
    limits: { fileSize: 8 * 1024 * 1024 } // 8MB Limit for banners
});

// Item Specific Storage
const itemDir = path.join(uploadDir, 'campaign_items');
if (!fs.existsSync(itemDir)) {
    fs.mkdirSync(itemDir, { recursive: true });
}

const itemStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, itemDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'item-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const uploadItem = multer({ 
    storage: itemStorage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB Limit for logos
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
            { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
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
                avatar: admin.avatar,
                role: admin.role
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
            'SELECT id, name, email, phone, avatar, role, created_at FROM admins WHERE id = ?',
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
        const { name, role, designation, bio, phone, display_order, state, district } = req.body;
        const image_url = req.file ? `/uploads/leaders_img/${req.file.filename}` : null;
        
        await query(
            'INSERT INTO leaders (name, role, designation, bio, image_url, phone, display_order, state, district) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, role, designation, bio, image_url, phone, display_order || 0, state || 'National', district || null]
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
        const { name, role, designation, bio, phone, display_order, state, district } = req.body;
        const { id } = req.params;
        
        let sql = 'UPDATE leaders SET name=?, role=?, designation=?, bio=?, phone=?, display_order=?, state=?, district=? WHERE id=?';
        let params = [name, role, designation, bio, phone, display_order || 0, state || 'National', district || null, id];

        if (req.file) {
            const image_url = `/uploads/leaders_img/${req.file.filename}`;
            sql = 'UPDATE leaders SET name=?, role=?, designation=?, bio=?, phone=?, display_order=?, state=?, district=?, image_url=? WHERE id=?';
            params = [name, role, designation, bio, phone, display_order || 0, state || 'National', district || null, image_url, id];
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
router.post('/gallery', authMiddleware, uploadGallery.single('image'), async (req, res) => {
    try {
        const { span_classes, display_order } = req.body;
        
        if (!req.file) return res.status(400).json({ error: 'Image file is required.' });
        
        const image_url = `/uploads/gallery_img/${req.file.filename}`;

        
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

// @route   POST /api/admin/gallery/bulk
router.post('/gallery/bulk', authMiddleware, uploadGallery.array('images', 50), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No image files provided.' });
        }

        const values = req.files.map(file => [
            `/uploads/gallery_img/${file.filename}`,
            'row-span-1 col-span-1',
            0
        ]);

        await query(
            'INSERT INTO gallery_images (image_url, span_classes, display_order) VALUES ?',
            [values]
        );

        res.status(201).json({ 
            message: `${req.files.length} images added successfully.`,
            count: req.files.length 
        });
    } catch (error) {
        console.error('Bulk gallery upload error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// @route   DELETE /api/admin/gallery/:id
router.delete('/gallery/:id', authMiddleware, async (req, res) => {
    try {
        // Role check: Only admin can delete
        if (req.admin.role !== 'admin') {
            return res.status(403).json({ error: 'Permission denied. Only full admins can delete photos.' });
        }

        await query('DELETE FROM gallery_images WHERE id=?', [req.params.id]);
        res.json({ message: 'Image deleted successfully.' });
    } catch (error) {
        console.error('Delete gallery error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// ==============================
// CAMPAIGN MANAGEMENT ROUTES
// ==============================

// @route   GET /api/admin/campaigns
router.get('/campaigns', authMiddleware, async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM campaigns ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Admin fetch campaigns error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   POST /api/admin/campaigns
router.post('/campaigns', authMiddleware, uploadCampaign.single('image'), async (req, res) => {
    try {
        const { title, short_description, description, goal_amount, status } = req.body;
        const image_url = req.file ? `/uploads/campaigns/${req.file.filename}` : null;
        
        const [result] = await query(
            'INSERT INTO campaigns (title, short_description, description, image_url, goal_amount, status) VALUES (?, ?, ?, ?, ?, ?)',
            [title, short_description, description, image_url, goal_amount || 0, status || 'active']
        );
        res.status(201).json({ message: 'Campaign created successfully.', id: result.insertId });
    } catch (error) {
        console.error('Add campaign error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   PUT /api/admin/campaigns/:id
router.put('/campaigns/:id', authMiddleware, uploadCampaign.single('image'), async (req, res) => {
    try {
        const { title, short_description, description, goal_amount, status, current_amount } = req.body;
        const { id } = req.params;
        
        let sql = 'UPDATE campaigns SET title=?, short_description=?, description=?, goal_amount=?, status=?, current_amount=? WHERE id=?';
        let params = [title, short_description, description, goal_amount, status, current_amount || 0, id];

        if (req.file) {
            const image_url = `/uploads/campaigns/${req.file.filename}`;
            sql = 'UPDATE campaigns SET title=?, short_description=?, description=?, goal_amount=?, status=?, current_amount=?, image_url=? WHERE id=?';
            params = [title, short_description, description, goal_amount, status, current_amount || 0, image_url, id];
        }

        await query(sql, params);
        res.json({ message: 'Campaign updated successfully.' });
    } catch (error) {
        console.error('Update campaign error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   DELETE /api/admin/campaigns/:id
router.delete('/campaigns/:id', authMiddleware, async (req, res) => {
    try {
        // This will also delete related items due to ON DELETE CASCADE
        await query('DELETE FROM campaigns WHERE id=?', [req.params.id]);
        res.json({ message: 'Campaign deleted successfully.' });
    } catch (error) {
        console.error('Delete campaign error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   GET /api/admin/campaigns/:id/items
router.get('/campaigns/:id/items', authMiddleware, async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM campaign_items WHERE campaign_id=?', [req.params.id]);
        res.json(rows);
    } catch (error) {
        console.error('Admin fetch items error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   POST /api/admin/campaigns/:id/items
router.post('/campaigns/:id/items', authMiddleware, uploadItem.single('image'), async (req, res) => {
    try {
        const { item_name, price_per_unit, unit_name } = req.body;
        const campaign_id = req.params.id;
        const image_url = req.file ? `/uploads/campaign_items/${req.file.filename}` : null;
        
        await query(
            'INSERT INTO campaign_items (campaign_id, item_name, price_per_unit, unit_name, image_url) VALUES (?, ?, ?, ?, ?)',
            [campaign_id, item_name, price_per_unit, unit_name || 'unit', image_url]
        );
        res.status(201).json({ message: 'Item added successfully.' });
    } catch (error) {
        console.error('Add item error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   DELETE /api/admin/items/:id
router.delete('/items/:id', authMiddleware, async (req, res) => {
    try {
        await query('DELETE FROM campaign_items WHERE id=?', [req.params.id]);
        res.json({ message: 'Item deleted successfully.' });
    } catch (error) {
        console.error('Delete item error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   GET /api/admin/donations
// @desc    Get all donation pledges for verification
router.get('/donations', authMiddleware, async (req, res) => {
    try {
        const sql = `
            SELECT d.*, c.title as campaign_title 
            FROM campaign_donations d 
            LEFT JOIN campaigns c ON d.campaign_id = c.id 
            ORDER BY d.created_at DESC
        `;
        const [rows] = await query(sql);
        res.json(rows);
    } catch (error) {
        console.error('Admin fetch donations error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   PUT /api/admin/donations/:id/status
// @desc    Approve/Reject a donation and update campaign progress
router.put('/donations/:id/status', authMiddleware, async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    const { id } = req.params;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status.' });
    }

    try {
        // Get the donation details first
        const [rows] = await query('SELECT * FROM campaign_donations WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Donation not found.' });
        
        const donation = rows[0];
        const oldStatus = donation.status;

        // If approving and it wasn't approved before, increment campaign amount
        if (status === 'approved' && oldStatus !== 'approved' && donation.campaign_id) {
            await query('UPDATE campaigns SET current_amount = current_amount + ? WHERE id = ?', [donation.amount, donation.campaign_id]);
        }
        
        // If un-approving (back to pending/rejected) and it WAS approved, decrement campaign amount
        if (status !== 'approved' && oldStatus === 'approved' && donation.campaign_id) {
            await query('UPDATE campaigns SET current_amount = GREATEST(0, current_amount - ?) WHERE id = ?', [donation.amount, donation.campaign_id]);
        }

        await query('UPDATE campaign_donations SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Donation ${status} successfully.` });

    } catch (error) {
        console.error('Admin update donation error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// ==============================
// MEMBERSHIP MANAGEMENT ROUTES
// ==============================

// @route   GET /api/admin/members
// @desc    Get all membership requests
router.get('/members', authMiddleware, async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM members ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Admin fetch members error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   PUT /api/admin/members/:id/status
// @desc    Approve/Reject a membership request
router.put('/members/:id/status', authMiddleware, async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!['approved', 'pending', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status.' });
    }

    try {
        const [result] = await query('UPDATE members SET status = ? WHERE id = ?', [status, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Membership request not found.' });
        }

        res.json({ message: `Membership status updated to ${status}.` });
    } catch (error) {
        console.error('Admin update membership status error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// @route   DELETE /api/admin/members/:id
// @desc    Delete a membership request
router.delete('/members/:id', authMiddleware, async (req, res) => {
    try {
        await query('DELETE FROM members WHERE id=?', [req.params.id]);
        res.json({ message: 'Membership request deleted successfully.' });
    } catch (error) {
        console.error('Delete member error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
