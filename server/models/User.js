const mongoose = require('mongoose');
// UserSchema: Defines the data structure for application users.
const UserSchema = new mongoose.Schema({
    // The display name or handle for the user
    username: { type: String, required: true }, 
    // Email field: Used as the primary login identifier.
    email: { type: String, required: true, unique: true },
    // The hashed string representing the user's password
    password: { type: String, required: true }
});
module.exports = mongoose.model('User', UserSchema);