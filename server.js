const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
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

// SPA Catch-all Route: Redirect all unmatched GET requests to index.html
// This allows React Router to handle deep links like /donate correctly
// Using Regex literal to avoid Express 5 string-parsing issues
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// App Listens
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
