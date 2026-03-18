const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Listing = require('../models/Listing');

// @route   POST api/listings
// @desc    Create a listing
router.post('/', auth, async (req, res) => {
  try {
    const { materialName, tons, description, price, location } = req.body;

    // Check if variables are reaching here
    if (!materialName || !tons) {
        return res.status(400).json({ message: "Missing materialName or tons" });
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
    console.error("CREATE LISTING ERROR ===", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;