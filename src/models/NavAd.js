import mongoose from 'mongoose';

const navAdSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: [true, 'Shop name is required'],
        default: 'SOOQRA ONE'
    },
    adText: {
        type: String,
        required: [true, 'Ad text is required'],
        maxlength: 100
    },
    couponCode: {
        type: String,
        required: false,
        maxlength: 20
    },
    buttonText: {
        type: String,
        required: false,
        default: 'Shop Now'
    },
    buttonLink: {
        type: String,
        required: false
    },
    backgroundColor: {
        type: String,
        default: 'bg-gradient-to-r from-purple-900 to-indigo-900'
    },
    textColor: {
        type: String,
        default: 'text-white'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
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
    }
}, {
    timestamps: true
});

export default mongoose.models.NavAd || mongoose.model('NavAd', navAdSchema);