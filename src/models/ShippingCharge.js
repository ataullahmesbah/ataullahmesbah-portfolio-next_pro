const mongoose = require('mongoose');

const ShippingChargeSchema = new mongoose.Schema({
    division: {
        type: String,
        required: true,
        unique: true,
        enum: ['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh', 'Others'],
    },
    charge: {
        type: Number,
        required: true,
        min: 0,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.models.ShippingCharge || mongoose.model('ShippingCharge', ShippingChargeSchema);