const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String }, // Stores the URL string
  category: { type: String, required: true }, 
  status: { type: String, default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);