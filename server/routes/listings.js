const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const auth = require('../middleware/authMiddleware');

// CREATE Listing
// CREATE Listing
router.post('/', auth, async (req, res) => {
    console.log("=== REQ.BODY RECEIVED FROM FRONTEND ===", JSON.stringify(req.body, null, 2));  // ← ADD THIS

    try {
        const newListing = new Listing({
            ...req.body,
            merchant: req.user.id
        });
        await newListing.save();
        res.status(201).json(newListing);
    } catch (err) {
        console.error("=== CREATE LISTING ERROR ===", err);
        res.status(500).json({ message: err.message || "Error saving listing" });
    }
});

// READ ALL Listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('merchant', 'username')   // ← Changed from user
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error("=== FETCH LISTINGS ERROR ===", err);
    res.status(500).json({ message: err.message || "Error fetching marketplace data" });
  }
});

// READ ONE Listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('merchant', 'username');
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (err) {
    console.error("=== GET ONE LISTING ERROR ===", err);
    res.status(500).json({ message: err.message });
  }
});

// UPDATE Listing
router.put('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.merchant.toString() !== req.user.id) {   // ← Changed to merchant
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('merchant', 'username');

    res.json(updated);
  } catch (err) {
    console.error("=== UPDATE LISTING ERROR ===", err);
    res.status(500).json({ message: err.message || "Error updating listing" });
  }
});

// DELETE Listing
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    if (listing.merchant.toString() !== req.user.id) {   // ← Changed to merchant
      return res.status(403).json({ message: "Unauthorized" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("=== DELETE LISTING ERROR ===", err);
    res.status(500).json({ message: err.message || "Error deleting listing" });
  }
});

module.exports = router;