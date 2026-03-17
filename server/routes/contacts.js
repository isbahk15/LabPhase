const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); // THIS LINE IS KEY

// Contact Submission Route
router.post('/', async (req, res) => {
  try {
    /** * 1. Create a new document instance using the request body.*/
    const newMessage = new Contact(req.body);
    await newMessage.save();
    //  Return a 201 Created status code to indicate success
    res.status(201).json({ success: true, message: "Message saved!" });
  } catch (err) {
    /*If validation fails (e.g., missing email) 
     * or the DB is down, catch the error and log it.*/
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
