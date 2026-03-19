const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const Listing = require('../models/Listing');

// @route   POST api/listings
router.post('/', auth, async (req, res) => {
  try {
    const { materialName, tons, description, price, location, image } = req.body;

    // Validation
    if (!materialName || !tons) {
      return res.status(400).json({ message: "Material name and tons are required." });
    }

    const newListing = new Listing({
      materialType: "Other",                    // ← default because new form has no dropdown
      materialName,
      description: description || "",
      tons,
      price: price || 0,
      image: image || "",                       // ← supports image URL when you add it later
      merchant: req.user.id,                    // ← FIXED: matches your model
      // location is ignored if not in schema (safe)
    });

    const listing = await newListing.save();
    res.json(listing);
  } catch (err) {
    console.error("BACKEND ERROR:", err);       // ← now logs full error for you
    res.status(500).json({ 
      message: "Server Error", 
      error: err.message 
    });
  }
});

// @route   GET api/listings (Marketplace + Dashboard)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });  // ← FIXED
    res.json(listings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;