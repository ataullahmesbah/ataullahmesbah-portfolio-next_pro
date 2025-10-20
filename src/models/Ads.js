// models/Ads.js
import mongoose from 'mongoose';

const adsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    buttonText: {
        type: String,
        default: 'Shop Now'
    },
    buttonLink: {
        type: String,
        required: true
    },
    targetPages: [{
        type: String,
        default: ['*']
    }],
    displayLimit: {
        type: Number,
        default: 3
    },
    displayTime: {
        type: Number,
        default: 10
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
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
    }
});

export default mongoose.models.Ads || mongoose.model('Ads', adsSchema);