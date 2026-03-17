const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// 1. Create - Now with a fallback for the image field
// backend/routes/listings.js
router.post('/', auth, async (req, res) => {
    try {
        const newListing = new Listing({
            ...req.body,
            // req.user.id comes from your auth middleware
            user: req.user.id 
        });
        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        res.status(500).json({ message: "Error saving listing" });
    }
});

// 2. Read All - Sorted by newest first
// backend/routes/listings.js
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('user', 'name');
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Read ONE - Crucial for your ProductDetail page
// Change your Get One route to this:
router.get('/:id', async (req, res) => {
  try {
    // .populate('user', 'name') swaps the ID for the actual name
    const listing = await Listing.findById(req.params.id).populate('user', 'name');
    if (!listing) return res.status(404).json({ message: "Not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
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