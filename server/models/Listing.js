const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  materialName: {
    type: String,
    required: true
  },
  tons: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number
  },
  location: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('listing', ListingSchema);