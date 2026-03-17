const mongoose = require('mongoose'); 
// this defines the rules for documents in the contact section
const ContactSchema = new mongoose.Schema({
  // required and true ensure that the database rejects any entry if any 1 field is missing
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true }
}, {
  // realtime time is added 'createdAt' and 'updatedAt'
  timestamps: true });
// compiles this schema into a model to allow the interface for searching, creating and deleting data
module.exports = mongoose.model('Contact', ContactSchema);