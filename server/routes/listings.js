const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// 1. Create - Now with a fallback for the image field
router.post('/', async (req, res) => {
    try {
        const { name, weight, price, description, image, category } = req.body;
        
        const newListing = new Listing({
            name,
            weight,
            price,
            description,
            // If image is an empty string, Mongoose will save it as is.
            // Our frontend Safe Image Helper handles the rest!
            image, 
            category
        });

        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ message: "Server Error saving listing" });
    }
});

// 2. Read All - Sorted by newest first
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Error fetching listings" });
  }
});

// 3. Read ONE - Crucial for your ProductDetail page
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    // Specifically catch malformed MongoDB IDs (CastError)
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid Listing ID format" });
    }
    res.status(500).json({ message: "Server error retrieving listing" });
  }
});

// 4. Delete - Clean removal
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Listing.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Listing already gone or not found" });
    }
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Error deleting listing" });
  }
});

module.exports = router;