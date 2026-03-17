const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Registration Route: Handles new user creation.
router.post('/register', async (req, res) => {
    try {
        // Ensure 'username' matches the 'name' attribute in your frontend input fields
        const { username, email, password } = req.body; 
        // 1. Check if the email is already registered in the database
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, email, password });
        //  Password Hashing:
        const salt = await bcrypt.genSalt(10);
        // Persist the user to MongoDB
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        // Generate token so they are logged in immediately after registering
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, msg: 'User registered successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login Route: Authenticates existing users.router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Verify that the user exists via their email
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
        // 2. Compare the provided plain-text password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
// 3. Issue a new JWT if the credentials are valid
        // The frontend will store this token for authorized requests
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;