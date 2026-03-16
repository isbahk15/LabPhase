const mongoose = require('mongoose');

const MerchantSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    wasteType: { type: String, required: true },
    estimatedWeight: { type: Number, required: true },
    status: { type: String, enum: ['Available', 'Pending', 'Completed'], default: 'Available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Merchant', MerchantSchema);