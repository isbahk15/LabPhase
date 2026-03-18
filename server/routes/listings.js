const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const Listing = require('../models/Listing');

// @route   POST api/listings
router.post('/', auth, async (req, res) => {
  try {
    const { materialName, tons, description, price, location } = req.body;

    // Validation to stop the "Path tons is required" error
    if (!materialName || !tons) {
      return res.status(400).json({ message: "Material name and tons are required." });
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
    console.error("BACKEND ERROR:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// @route   GET api/listings (For the Dashboard/Marketplace)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ date: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;