const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET all listings for the Marketplace
router.get('/all', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching listings" });
    }
});

// POST a new listing from the Dashboard
router.post('/post', async (req, res) => {
    const { title, description, price, location, category } = req.body;
    try {
        const newPost = new Post({ title, description, price, location, category });
        const savedPost = await newPost.save();
        res.json(savedPost);
    } catch (err) {
        res.status(500).json({ message: "Error saving listing" });
    }
});

module.exports = router;