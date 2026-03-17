const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  // this is for the prduct information
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  
  category: { type: String, required: true }, 
  status: { type: String, default: "Active" }
}, { timestamps: true });
// "Listing" will be the collection name in MongoDB
module.exports = mongoose.model('Listing', listingSchema);