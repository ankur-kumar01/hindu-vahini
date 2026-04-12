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

// Dynamic Sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
    const siteUrl = `${req.protocol}://${req.get('host')}`;
    try {
        const [campaigns] = await query('SELECT id FROM campaigns WHERE status = "active"');
        const [leaders] = await query('SELECT name FROM leaders');
        
        const staticRoutes = ['', '/leadership', '/gallery', '/donate', '/campaigns', '/join-us', '/contact'];
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Static Pages
        staticRoutes.forEach(route => {
            xml += `\n  <url>\n    <loc>${siteUrl}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>`;
        });

        // Dynamic Campaigns
        campaigns.forEach(c => {
            xml += `\n  <url>\n    <loc>${siteUrl}/campaigns/${c.id}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>`;
        });

        // Dynamic Leadership Profiles
        leaders.forEach(l => {
            xml += `\n  <url>\n    <loc>${siteUrl}/leadership?leader=${encodeURIComponent(l.name)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
        });

        xml += `\n</urlset>`;
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (err) {
        console.error('Sitemap Error:', err);
        res.status(500).send('Error generating sitemap');
    }
});

// SPA Catch-all Route with Bulletproof Dynamic OG Tag Injection
app.get(/^(?!\/api).*/, async (req, res) => {
    const indexPath = path.resolve(__dirname, 'public', 'index.html');
    
    // Dynamic Resolution: Works on production, staging, and local tunnels (ngrok)
    const siteUrl = `${req.protocol}://${req.get('host')}`;
    const userAgent = req.headers['user-agent'] || "";
    
    // Log crawler access for debugging
    const isCrawler = /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot/i.test(userAgent);
    if (isCrawler) {
        console.log(`[Crawler Detected] ${userAgent.split(' ')[0]} - Path: ${req.path}`);
    }

    if (!fs.existsSync(indexPath)) {
        return res.status(404).send('Site content not found. Please run build.');
    }

    // Helper to resolve absolute image URLs for crawlers
    const getAbsoluteUrl = (img) => {
        if (!img) return `${siteUrl}/our_vision.jpeg`;
        if (img.startsWith('http')) return img;
        return `${siteUrl}${img.startsWith('/') ? '' : '/'}${img}`;
    };

    // Helper to determine image MIME type
    const getImageType = (img) => {
        if (!img) return "image/jpeg";
        if (img.toLowerCase().endsWith('.png')) return "image/png";
        if (img.toLowerCase().endsWith('.webp')) return "image/webp";
        return "image/jpeg";
    };

    // Simple HTML escaper
    const escapeHtml = (unsafe) => {
        if (!unsafe) return "";
        return unsafe.toString()
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

        // 1. Campaign Detail Pattern
        const campaignMatch = req.path.match(/\/campaigns\/(\d+)/);
        if (campaignMatch) {
            const campaignId = campaignMatch[1];
            const [rows] = await query('SELECT title, short_description, image_url FROM campaigns WHERE id = ?', [campaignId]);
            if (rows && rows.length > 0) {
                title = `${rows[0].title} | Mission`;
                description = rows[0].short_description || description;
                image = rows[0].image_url || image;
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
                description = `${rows[0].role} at HinduVahini. View official membership profile.`;
                image = rows[0].image_url || "/logo.png";
            }
        }

        const fullImgUrl = getAbsoluteUrl(image);
        const imageType = getImageType(image);
        const escapedTitle = escapeHtml(title);
        const escapedDesc = escapeHtml(description);
        
        const metaTags = `
            <meta property="og:image" content="${fullImgUrl}" />
            <meta property="og:image:secure_url" content="${fullImgUrl}" />
            <meta property="og:image:type" content="${imageType}" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <title>${escapedTitle}</title>
            <meta name="description" content="${escapedDesc}" />
            <meta property="og:title" content="${escapedTitle}" />
            <meta property="og:description" content="${escapedDesc}" />
            <meta property="og:url" content="${siteUrl}${req.originalUrl}" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="HinduVahini" />
            <meta property="og:locale" content="en_IN" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="${escapedTitle}" />
            <meta name="twitter:description" content="${escapedDesc}" />
            <meta name="twitter:image" content="${fullImgUrl}" />
        `;

        const data = await fs.promises.readFile(indexPath, 'utf8');
        const updatedHtml = data
            .replace(/<title>.*?<\/title>/, '') 
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
