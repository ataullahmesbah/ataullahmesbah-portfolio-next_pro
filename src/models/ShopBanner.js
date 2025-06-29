const mongoose = require('mongoose');

const ShopBannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        required: true,
        trim: true,
    },
    highlights: {
        type: [String],
        required: true,
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one highlight is required',
        },
    },
    cta: {
        type: String,
        required: true,
        trim: true,
    },
    bg: {
        type: String,
        required: true,
        trim: true,
    },
    textColor: {
        type: String,
        required: true,
        trim: true,
    },
    badgeColor: {
        type: String,
        required: true,
        trim: true,
    },
    features: {
        type: [
            {
                icon: { type: String, required: true },
                text: { type: String, required: true },
            },
        ],
        required: true,
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one feature is required',
        },
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    link: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.models.ShopBanner || mongoose.model('ShopBanner', ShopBannerSchema);