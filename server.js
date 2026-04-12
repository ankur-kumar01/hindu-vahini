const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { initDB, query } = require('./config/db');
require('dotenv').config();

const app = express();

// Initialize Database
initDB();

// Security and Logging Middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); // Essential for parsing form data

// API Routes
app.use('/api', require('./routes/api'));
app.use('/api/admin', require('./routes/admin'));

// Static Resource Serving
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SPA Catch-all Route with Dynamic OG Tag Injection
app.get(/^(?!\/api).*/, async (req, res) => {
    const indexPath = path.resolve(__dirname, 'public', 'index.html');
    const siteUrl = "https://hinduvahini.online";
    
    if (!fs.existsSync(indexPath)) {
        return res.status(404).send('Site content not found. Please run build.');
    }

    // Helper to resolve absolute image URLs for crawlers
    const getAbsoluteUrl = (img) => {
        if (!img) return `${siteUrl}/our_vision.jpeg`;
        if (img.startsWith('http')) return img;
        // Handle images starting with / and those that don't
        return `${siteUrl}${img.startsWith('/') ? '' : '/'}${img}`;
    };

    // Simple HTML escaper to prevent breakage in content attributes
    const escapeHtml = (unsafe) => {
        if (!unsafe) return "";
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    try {
        let title = "HinduVahini | Preserving Culture, Empowering Communities";
        let description = "HinduVahini is a cultural NGO dedicated to preserving our rich heritage and advancing educational empowerment.";
        let image = "/our_vision.jpeg";

        // 1. Campaign Detail Pattern: /campaigns/:id
        const campaignMatch = req.path.match(/\/campaigns\/(\d+)/);
        if (campaignMatch) {
            const campaignId = campaignMatch[1];
            const [rows] = await query('SELECT title, short_description, image_url FROM campaigns WHERE id = ?', [campaignId]);
            if (rows && rows.length > 0) {
                const camp = rows[0];
                title = `${camp.title} | Mission`;
                description = camp.short_description || description;
                image = camp.image_url || image;
            }
        } 
        // 2. Gallery Search Pattern
        else if (req.path === '/gallery' && req.query.img) {
            title = "Photo Highlight | HinduVahini";
            description = "View this special moment from our community journey.";
            image = req.query.img;
        }
        // 3. Leadership Profile Pattern
        else if (req.path === '/leadership' && req.query.leader) {
            const leaderName = req.query.leader;
            const [rows] = await query('SELECT role, image_url FROM leaders WHERE name = ?', [leaderName]);
            if (rows && rows.length > 0) {
                title = `${leaderName} Profile | HinduVahini`;
                description = `${rows[0].role} at HinduVahini Trust. View official profile.`;
                image = rows[0].image_url || "/logo.png";
            } else {
                title = `${leaderName} | Leadership`;
            }
        }

        const fullImgUrl = getAbsoluteUrl(image);
        const escapedTitle = escapeHtml(title);
        const escapedDesc = escapeHtml(description);
        
        const metaTags = `
            <title>${escapedTitle}</title>
            <meta name="description" content="${escapedDesc}" />
            <meta property="og:title" content="${escapedTitle}" />
            <meta property="og:description" content="${escapedDesc}" />
            <meta property="og:image" content="${fullImgUrl}" />
            <meta property="og:image:secure_url" content="${fullImgUrl}" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content="${siteUrl}${req.originalUrl}" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="HinduVahini" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${escapedTitle}" />
            <meta name="twitter:description" content="${escapedDesc}" />
            <meta name="twitter:image" content="${fullImgUrl}" />
        `;

        const data = await fs.promises.readFile(indexPath, 'utf8');
        const updatedHtml = data
            .replace(/<title>.*?<\/title>/, '') // Remove default title
            .replace('<head>', `<head>${metaTags}`);
        
        res.send(updatedHtml);

    } catch (err) {
        console.error('OG Tag Injection Error:', err);
        res.sendFile(indexPath);
    }
});

// App Listens
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
