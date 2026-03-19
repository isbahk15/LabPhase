const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const Listing = require('../models/Listing');

// @route   POST api/listings
router.post('/', auth, async (req, res) => {
  try {
    // ← SAFETY CHECK (this stops the "req.user is undefined" crash)
    if (!req.user) {
      return res.status(401).json({ 
        message: "Not authorized. Please log in again." 
      });
    }

    const { materialName, tons, description, price, location, image } = req.body;

    if (!materialName || !tons) {
      return res.status(400).json({ message: "Material name and tons are required." });
    }

    const newListing = new Listing({
      materialType: "Other",           // default (your new form has no dropdown yet)
      materialName,
      description: description || "",
      tons: Number(tons),
      price: Number(price) || 0,
      location: location || "",
      image: image || "",
      merchant: req.user.id            // ← this line was crashing before
    });

    const listing = await newListing.save();
    res.json({ message: "Listing created successfully!", listing });
  } catch (err) {
    console.error("BACKEND ERROR:", err);   // full error in Render logs
    res.status(500).json({ 
      message: "Server Error", 
      error: err.message 
    });
  }
});

// @route   GET api/listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;