const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Middleware to protect private routes
const Listing = require('../models/Listing');        // The Mongoose model/blueprint

/**
 * @route   POST api/listings
 * @desc    Create a new material listing
 * @access  Private (Requires JWT Token)
 */
router.post('/', auth, async (req, res) => {
  try {
    // 1. AUTH CHECK: Ensure the middleware successfully attached the user to the request
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized. Please log in again." });
    }

    // 2. DESTRUCTURE: Get data from the frontend form
    const { materialName, tons, description, price, location } = req.body;

    // 3. VALIDATION: Ensure critical fields aren't empty before hitting the database
    if (!materialName || !tons) {
      return res.status(400).json({ message: "Material name and tons are required." });
    }

    // 4. INSTANTIATE: Create a new document using the Listing Schema
    const newListing = new Listing({
      // We pull the ID from the token (req.user) to link this post to its creator
      user: req.user.id,        
      materialName,
      description: description || "", // Fallback to empty string if no description
      tons: Number(tons),             // Force conversion to number for data integrity
      price: Number(price) || 0,
      location: location || "",
    });

    // 5. SAVE: Write the document to MongoDB
    const listing = await newListing.save();
    
    // Return the newly created listing so the frontend can display a success message
    res.json({ message: "Listing created successfully!", listing });
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/**
 * @route   GET api/listings
 * @desc    Fetch all available listings for the Marketplace
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    /**
     * DATABASE QUERY
     * .find(): Gets everything in the listings collection.
     * .sort({ date: -1 }): Orders them so the newest posts appear first (Descending).
     */
    const listings = await Listing.find().sort({ date: -1 }); 
    res.json(listings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

/**
 * @route   GET api/listings/:id
 * @desc    Fetch a single listing by its unique MongoDB ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    // Uses the ID from the URL (req.params.id) to find the specific document
    const listing = await Listing.findById(req.params.id);
    
    // If the ID doesn't exist, return 404
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    
    res.json(listing);
  } catch (err) {
    // If the ID is malformed (too short/long), it triggers an error
    res.status(500).send('Server Error');
  }
});

module.exports = router;