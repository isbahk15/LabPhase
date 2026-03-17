const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/authMiddleware');

// CREATE Listing
router.post('/', auth, async (req, res) => {
    try {
        const newListing = new Listing({
            ...req.body,
            user: req.user.id 
        });
        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        res.status(500).json({ message: "Error saving listing" });
    }
});

// READ ALL Listings (Fixed: This was missing and is needed by Marketplace.jsx)
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().populate('user', 'username').sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching marketplace data" });
  }
});

// READ ONE Listing (Fixed duplicate route logic)
router.get('/:id', async (req, res) => {
  try {
    // Populate allows the frontend to see the merchant's name instead of just an ID
    const listing = await Listing.findById(req.params.id).populate('user', 'username');
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE Listing
router.delete('/:id', auth, async (req, res) => { // Added auth to ensure only owner can delete
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