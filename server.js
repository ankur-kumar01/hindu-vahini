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
// Using Regex Pattern to avoid interfering with /api routes
app.get(/^(?!\/api).*/, (req, res) => {
    const indexPath = path.resolve(__dirname, 'public', 'index.html');
    
    // For Gallery sharing with specific images, inject meta tags for social previews
    if (req.path === '/gallery' && req.query.img) {
        if (!fs.existsSync(indexPath)) {
            return res.status(404).send('Site content not found. Please run build.');
        }

        fs.readFile(indexPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading index.html:', err);
                return res.sendFile(indexPath);
            }

            const img = req.query.img;
            const siteUrl = "https://hinduvahini.online";
            const fullImgUrl = img.startsWith('http') ? img : `${siteUrl}${img}`;
            
            const metaTags = `
                <meta property="og:title" content="Photo Highlight | HinduVahini" />
                <meta property="og:description" content="View this special moment from our community journey." />
                <meta property="og:image" content="${fullImgUrl}" />
                <meta property="og:url" content="${siteUrl}${req.originalUrl}" />
            `;
            
            // Inject after <head>
            const updatedHtml = data.replace('<head>', `<head>${metaTags}`);
            res.send(updatedHtml);
        });
    } else {
        // Normal SPA routing
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            res.status(404).send('Requested resource not found.');
        }
    }
});

// App Listens
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
