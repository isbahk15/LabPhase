const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // THIS LINE IS KEY

router.post('/', async (req, res) => {
  try {
    const newMessage = new Contact(req.body);
    await newMessage.save();
    res.status(201).json({ success: true, message: "Message saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;