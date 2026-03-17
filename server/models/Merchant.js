const mongoose = require('mongoose');
// this stores the posts created by the merchants
const MerchantSchema = new mongoose.Schema({
    // this us for the user who posted this
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    wasteType: { type: String, required: true },
    estimatedWeight: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Pending', 'Completed'], default: 'Available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Merchant', MerchantSchema);