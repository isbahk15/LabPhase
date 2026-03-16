const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // This looks for MONGO_URI in your .env file
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully...');
    } catch (err) {
        console.error('MongoDB Connection Failed:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;