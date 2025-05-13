const mongoose = require('mongoose');

const UsedCouponSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    couponCode: {
        type: String,
        required: true,
    },
    usedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.models.UsedCoupon || mongoose.model('UsedCoupon', UsedCouponSchema);