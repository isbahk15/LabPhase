const mongoose = require('mongoose');
// PostSchema: Defines the blueprint for community posts.
const PostSchema = new mongoose.Schema({
    // The headline of the post (e.g., "Dry Maize Stalks for Mulching")
    title: { type: String, required: true },
    // Detailed body text explaining the offer or request
    description: { type: String, required: true },
// Cost associated with the post; stored as a Number
    price: { type: Number, required: true },

  

    category: { type: String },
     // e.g., Husks, Manure, Stalks

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);