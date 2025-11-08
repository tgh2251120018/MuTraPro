// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.config');

// Import API routes
const requestRoutes = require('./routes/request.routes');

// Initialize Express app
const app = express();

// Define PORT
const PORT = process.env.PORT || 3002;

// --- Middlewares ---
// Enable Cross-Origin Resource Sharing
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());
// Parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// --- Database Connection ---
connectDB();

// --- API Routes ---
// Mount the request routes under the /api/requests path
app.use('/requests', requestRoutes);

// --- Root Endpoint ---
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Service Request Management API.' });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});