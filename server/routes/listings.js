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

// READ ALL Listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching marketplace data" });
  }
});

// READ ONE Listing
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('user', 'username');
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE Listing (Added - full CRUD now complete)
router.put('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Only the owner can update
    if (listing.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You can only edit your own listings" });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('user', 'username');

    res.json(updatedListing);
  } catch (err) {
    res.status(500).json({ message: "Error updating listing" });
  }
});

// DELETE Listing - FIXED: Now properly enforces owner-only access
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Only the owner can delete
    if (listing.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own listings" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Error deleting listing" });
  }
});

module.exports = router;