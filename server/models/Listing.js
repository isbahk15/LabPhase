const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    // ✅ IMAGE FIELD ADDED (this stops the 500)
    image: {
        type: String,
        default: ''
    },
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);