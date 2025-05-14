const mongoose = require('mongoose');

const UsedCouponSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: false,
    },
    couponCode: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    usedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.models.UsedCoupon || mongoose.model('UsedCoupon', UsedCouponSchema);