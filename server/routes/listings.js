

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const Listing = require('../models/Listing');

// @route   POST api/listings
router.post('/', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized. Please log in again." });
    }

    const { materialName, tons, description, price, location } = req.body;

    if (!materialName || !tons) {
      return res.status(400).json({ message: "Material name and tons are required." });
    }

    const newListing = new Listing({
      user: req.user.id,        // FIX: Changed 'merchant' to 'user' to match your Listing.js model
      materialName,
      description: description || "",
      tons: Number(tons),
      price: Number(price) || 0,
      location: location || "",
      // Removed 'materialType' and 'image' because they aren't in your Listing.js Schema
    });

    const listing = await newListing.save();
    res.json({ message: "Listing created successfully!", listing });
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// @route   GET api/listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ date: -1 }); // Fixed sort field to 'date'
    res.json(listings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/listings/:id (Added for View Details functionality)
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;