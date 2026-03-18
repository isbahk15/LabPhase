const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Match your authMiddleware.js exactly
const Listing = require('../models/Listing');

// @route   POST api/listings
// @desc    Create a listing
router.post('/', auth, async (req, res) => {
  try {
    const { materialName, tons, description, price, location } = req.body;

    // Validation check
    if (!materialName || !tons) {
      return res.status(400).json({ message: "Material name and quantity (tons) are required." });
    }

    const newListing = new Listing({
      materialName,
      tons,
      description,
      price,
      location,
      user: req.user.id
    });

    const listing = await newListing.save();
    res.json(listing);
  } catch (err) {
    console.error("LISTING ERROR:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// @route   GET api/listings
// @desc    Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ date: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;