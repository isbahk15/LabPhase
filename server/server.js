// DNS Configuration
const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '1.0.0.1', '8.8.8.8']);

const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db'); 
require('dotenv').config();

const app = express();

// 🚨 NEW: Catch crashes so we can see the real error in Render logs
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ UNHANDLED REJECTION:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('❌ UNCAUGHT EXCEPTION:', err);
});

// 1. Connect to MongoDB
connectDB(); 

// 2. Middleware - Smart CORS
// Updated to ensure Vercel and Localhost are always permitted
const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        const isVercel = /\.vercel\.app$/.test(origin);
        const isLocal = allowedOrigins.includes(origin);

        if (isVercel || isLocal) {
            callback(null, true);
        } else {
            console.log("CORS Blocked Origin:", origin); // Helps debug in Render logs
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

// 4. Global Error Middleware (Prevents "Not working" blank responses)
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err.stack);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 AgroLoop Server running on port ${PORT}`);
});