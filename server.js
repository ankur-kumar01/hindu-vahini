const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// Security and Logging Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disabling temporarily to ensure inline scripts/fonts load correctly
}));
app.use(cors());
app.use(morgan('dev'));

// Static Resource Serving
app.use(express.static(path.join(__dirname, 'public')));

// Explicit Route Handling (Optional for standard HTML setups)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// App Listens
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
