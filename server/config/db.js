const mongoose = require('mongoose');
require('dotenv').config();
// loads the variables present in .env file into the process.env 

const connectDB = async () => {
    try {
        // This looks for MONGO_URI in your .env file the one that has the cluster connection string
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully...');
        // shows a message if the connection is successfull
    } catch (err) {
        console.error('MongoDB Connection Failed:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};
// exports connectDB so that it can be imported in the main file
module.exports = connectDB;