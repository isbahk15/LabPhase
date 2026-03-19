const mongoose = require('mongoose');

/**
 * LISTING SCHEMA DEFINITION
 * This defines the structure of the documents within your 'listings' collection.
 * Mongoose uses this to validate data before it is saved to MongoDB.
 */
const ListingSchema = new mongoose.Schema({
  /**
   * USER REFERENCE (Relationship)
   * This field stores the unique ID of the user who created the listing.
   * 'ref: user' tells Mongoose to look in the 'users' collection if we 
   * ever want to "populate" the listing with the creator's full profile.
   */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },

  /**
   * CORE MATERIAL DATA
   * materialName: The title of the listing (e.g., "Scrap Copper").
   * tons: Stored as a Number to allow for mathematical sorting/filtering.
   * 'required: true' ensures the database rejects any listing missing these keys.
   */
  materialName: {
    type: String,
    required: true
  },
  tons: {
    type: Number,
    required: true
  },

  /**
   * OPTIONAL FIELDS
   * These provide context but aren't strictly required for the record to exist.
   */
  description: {
    type: String
  },
  price: {
    type: Number
  },
  location: {
    type: String
  },

  /**
   * TIMESTAMP
   * Automatically records when the listing was created.
   * 'Date.now' is passed as a reference, so it generates the time at the 
   * exact moment the document is saved.
   */
  date: {
    type: Date,
    default: Date.now
  }
});

/**
 * EXPORT THE MODEL
 * We compile the schema into a model named 'listing'.
 * MongoDB will automatically create a collection named 'listings' (plural).
 */
module.exports = mongoose.model('listing', ListingSchema);