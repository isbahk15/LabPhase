const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user and return a token
 */
router.post('/register', async (req, res) => {
    try {
        // Updated to include 'role' from the request body
        const { username, email, password, role } = req.body; 
        
        // 1. Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Create new user instance (now including role)
        user = new User({ username, email, password, role: role || 'client' });

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        // 4. Save user to MongoDB
        await user.save();

        // 5. Generate and return JWT
        // Included 'role' in the payload for easier frontend access
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(201).json({ 
            token, 
            role: user.role, // Explicitly sending role for localStorage
            msg: 'User registered successfully' 
        });

    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).send('Server error');
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 2. Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. Generate and return JWT
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Returning both token and role to satisfy Frontend storage needs
        res.json({ token, role: user.role });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).send('Server error');
    } 
});

module.exports = router;