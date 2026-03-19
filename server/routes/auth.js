const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @route   POST /api/auth/register
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body; 
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, email, password, role: role || 'client' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        await user.save();

        // FIX: Wrap the payload in a 'user' object to match authMiddleware
        const payload = {
            user: { id: user._id, role: user.role }
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' } // Increased to 24h so you don't get logged out while testing
        );

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
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // FIX: Wrap the payload in a 'user' object to match authMiddleware
        const payload = {
            user: { id: user._id, role: user.role }
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ token, role: user.role });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).send('Server error');
    } 
});

module.exports = router;