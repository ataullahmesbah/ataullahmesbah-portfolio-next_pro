const mongoose = require('mongoose');

const UsedCouponSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

UsedCouponSchema.index({ userId: 1, couponCode: 1 }, { unique: true });

module.exports = mongoose.models.UsedCoupon || mongoose.model('UsedCoupon', UsedCouponSchema);