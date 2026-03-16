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
app.use('/api/auth', require('./routes/auth'));
app.use('/api/merchant', require('./routes/merchant'));
app.use('/api/listings', require('./routes/listings')); 

// --- NEW ROUTE ADDED HERE ---
app.use('/api/contacts', require('./routes/contacts')); 

// 4. Basic Health Check (Optional but helpful)
app.get('/', (req, res) => {
    res.send('AgroLoop API is running...');
});

// 5. Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 AgroLoop Server running on port ${PORT}`);
});