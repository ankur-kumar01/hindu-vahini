const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { initDB } = require('./config/db');
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

// Static Resource Serving
app.use(express.static(path.join(__dirname, 'public')));

// SPA Catch-all Route with Dynamic OG Tag Injection
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    
    // For Gallery sharing with specific images, inject meta tags for social previews
    if (req.path === '/gallery' && req.query.img) {
        fs.readFile(indexPath, 'utf8', (err, data) => {
            if (err) return res.sendFile(indexPath);

            const img = req.query.img;
            const siteUrl = "https://hinduvahini.online";
            const fullImgUrl = img.startsWith('http') ? img : `${siteUrl}${img}`;
            
            const metaTags = `
                <meta property="og:title" content="Photo Highlight | HinduVahini" />
                <meta property="og:description" content="View this special moment from our community journey." />
                <meta property="og:image" content="${fullImgUrl}" />
                <meta property="og:url" content="${siteUrl}${req.originalUrl}" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="${fullImgUrl}" />
            `;
            
            const updatedHtml = data.replace('<head>', `<head>${metaTags}`);
            return res.send(updatedHtml);
        });
    } else {
        res.sendFile(indexPath);
    }
});

// App Listens
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
