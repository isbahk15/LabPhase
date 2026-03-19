const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Import the Mongoose model for your listings

/**
 * @route   GET /api/posts/all
 * @desc    Fetch all marketplace listings
 * @access  Public
 */
router.get('/all', async (req, res) => {
    try {
        /**
         * DATABASE QUERY
         * .find(): Retrieves all documents from the 'posts' collection.
         * .sort({ createdAt: -1 }): Orders the results by creation date.
         * -1 indicates Descending order (Newest first).
         */
        const posts = await Post.find().sort({ createdAt: -1 });
        
        // Return the array of posts as a JSON response to the frontend
        res.json(posts);
    } catch (err) {
        // Standard 500 status code for unexpected server-side errors
        res.status(500).json({ message: "Error fetching listings" });
    }
});

/**
 * @route   POST /api/posts/post
 * @desc    Create a new material listing via the Merchant Dashboard
 * @access  Private (Should ideally be protected by auth middleware)
 */
router.post('/post', async (req, res) => {
    // 1. DESTRUCTURE: Extract the specific fields sent from the frontend form
    const { title, description, price, location, category } = req.body;
    
    try {
        // 2. INSTANTIATE: Create a new instance of the Post model with the provided data
        const newPost = new Post({ 
            title, 
            description, 
            price, 
            location, 
            category 
        });

        // 3. PERSIST: Save the new listing document into MongoDB
        const savedPost = await newPost.save();
        
        // 4. RESPONSE: Send the newly created object back to the client for confirmation
        res.json(savedPost);
    } catch (err) {
        // Triggers if validation fails (e.g., missing a required field) or database is down
        res.status(500).json({ message: "Error saving listing" });
    }
});

module.exports = router;