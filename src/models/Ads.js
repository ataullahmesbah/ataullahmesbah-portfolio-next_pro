// models/Ads.js
import mongoose from 'mongoose';

const adsSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    image: {
        type: String, // Cloudinary URL
        required: false
    },
    buttonText: {
        type: String,
        trim: true,
        maxlength: 30,
        default: 'Shop Now'
    },
    buttonLink: {
        type: String,
        trim: true
    },
    couponCode: {
        type: String,
        trim: true,
        maxlength: 20
    },
    // Display settings
    autoCloseDelay: {
        type: Number, // in seconds
        default: 10,
        min: 5,
        max: 60
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Appearance
    backgroundColor: {
        type: String,
        default: '#7C3AED' // Purple
    },
    textColor: {
        type: String,
        default: '#FFFFFF' // White
    },
    buttonColor: {
        type: String,
        default: '#F59E0B' // Amber
    },
    // Priority and ordering
    priority: {
        type: Number,
        default: 1,
        min: 1,
        max: 10
    },
    // Tracking
    impressions: {
        type: Number,
        default: 0
    },
    clicks: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update updatedAt before saving
adsSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Check if ad is currently active
adsSchema.methods.isCurrentlyActive = function () {
    const now = new Date();
    if (!this.isActive) return false;
    if (this.startDate > now) return false;
    if (this.endDate && this.endDate < now) return false;
    return true;
};

export default mongoose.models.Ads || mongoose.model('Ads', adsSchema);