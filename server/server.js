// DNS Configuration
const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '1.0.0.1', '8.8.8.8']);

const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db'); 
require('dotenv').config();

const app = express();

// 🚨 NEW: Catch crashes so we can see the real error
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ UNHANDLED REJECTION:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION:', err);
});

// 1. Connect to MongoDB
connectDB(); 

// 2. Middleware - Smart CORS
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || /\.vercel\.app$/.test(origin) || origin === 'http://localhost:5173') {
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

// Health check
app.get('/', (req, res) => {
    res.send('AgroLoop API is running...');
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 AgroLoop Server running on port ${PORT}`);
});