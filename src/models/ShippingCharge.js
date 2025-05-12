const mongoose = require('mongoose');

const ShippingChargeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        enum: ['Dhaka-Chattogram', 'Others'],
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

ShippingChargeSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.models.ShippingCharge || mongoose.model('ShippingCharge', ShippingChargeSchema);