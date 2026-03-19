const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Mongoose User model
const bcrypt = require('bcryptjs');     // For password hashing
const jwt = require('jsonwebtoken');   // For creating secure tokens

/**
 * @route   POST /api/auth/register
 * @desc    Handles new user creation
 */
router.post('/register', async (req, res) => {
    try {
        // 1. EXTRACT: Pull data from the incoming request body
        const { username, email, password, role } = req.body; 
        
        // 2. CHECK: Ensure the user doesn't already exist in the database
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 3. INITIALIZE: Create a new user instance (but don't save yet)
        // Default role is set to 'client' if nothing is provided
        user = new User({ username, email, password, role: role || 'client' });

        // 4. SECURITY: Use bcrypt to scramble the password
        // genSalt(10) creates a complex string added to the password to prevent "Rainbow Table" attacks
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt); // Replaces plain text with hash
        
        // 5. PERSIST: Save the new user to MongoDB
        await user.save();

        // 6. PAYLOAD: Data to include inside the token
        // Wrapping in 'user' ensures it matches the 'decoded.user' logic in your authMiddleware
        const payload = {
            user: { id: user._id, role: user.role }
        };

        // 7. SIGN: Create the JWT (The "Digital Passport")
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, // Secret key from .env
            { expiresIn: '24h' }    // Token lasts for 24 hours
        );

        // 8. RESPONSE: Send the token back to the frontend
        res.status(201).json({ 
            token, 
            role: user.role, 
            msg: 'User registered successfully' 
        });

    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticates existing users
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. IDENTIFY: Find the user by their email
        let user = await User.findOne({ email });
        if (!user) {
            // Security tip: Use a generic "Invalid Credentials" message to prevent email fishing
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 2. VERIFY: Compare the plain text password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. PAYLOAD: Prepare user data for the token
        const payload = {
            user: { id: user._id, role: user.role }
        };

        // 4. SIGN: Issue a new token for this session
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // 5. SUCCESS: Send token to frontend to be stored in localStorage
        res.json({ token, role: user.role });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).send('Server error');
    } 
});

module.exports = router;