// DNS Configuration: for my device becaouse it was preventing a connection
const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '1.0.0.1', '8.8.8.8']);

const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db'); 
require('dotenv').config();

const app = express();

// 1. Connect to MongoDB
connectDB(); 

// 2. Middleware
app.use(cors()); 
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true })); 

// 3. Routes
// Updated to match the frontend axios calls for /api/auth/login and /api/auth/register
app.use('/api/auth', require('./routes/auth'));

// Handles merchant-specific actions like fetching their own items
app.use('/api/merchant', require('./routes/merchant'));

// Handles global marketplace listings (fetching all and fetching by ID)
app.use('/api/listings', require('./routes/listings')); 

// New Route: Handles contact form submissions from the Landing page
app.use('/api/contacts', require('./routes/contacts')); 

// A simple endpoint to verify the server is online and reachable
app.get('/', (req, res) => {
    res.send('AgroLoop API is running...');
});

// 5. Start Server to define the network port and starts listening for incoming requests.
// Note: When deploying to Render, use process.env.PORT to allow the platform to assign a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 AgroLoop Server running on port ${PORT}`);
});