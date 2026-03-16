const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String },
    category: { type: String }, // e.g., Husks, Manure, Stalks
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);