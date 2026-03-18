// DNS Configuration: for my device because it was preventing a connection
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
// ✅ SMART CORS: Allows ALL Vercel preview URLs (*.vercel.app) + localhost
// No more manual updates every time Vercel creates a new preview!
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://lab-phase-whgr.vercel.app',
            'https://lab-phase-whgr-hc89q9c2s-isbahs-projects-59c0c0f4.vercel.app',
            'http://localhost:5173'
        ];

        // Allow any Vercel preview or production domain
        if (!origin || 
            allowedOrigins.includes(origin) || 
            /\.vercel\.app$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
})); 

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true })); 

// 3. Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/merchant', require('./routes/merchant'));
app.use('/api/listings', require('./routes/listings')); 
app.use('/api/contacts', require('./routes/contacts')); 

// Health check endpoint
app.get('/', (req, res) => {
    res.send('AgroLoop API is running...');
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 AgroLoop Server running on port ${PORT}`);
});