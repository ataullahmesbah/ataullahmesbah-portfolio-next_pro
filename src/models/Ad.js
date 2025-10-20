import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    buttonText: {
        type: String,
        required: [true, 'Button text is required'],
        trim: true
    },
    buttonLink: {
        type: String,
        required: [true, 'Button link is required'],
        trim: true
    },
    viewLimitPerUser: {
        type: Number,
        default: 5,
        min: 1
    },
    pages: {
        type: [String],
        default: ['*'],
        validate: {
            validator: function (pages) {
                return pages && pages.length > 0;
            },
            message: 'At least one page must be selected'
        }
    },
    displaySeconds: {
        type: Number,
        default: 10,
        min: 5,
        max: 60
    },
    priority: {
        type: Number,
        default: 1,
        min: 1,
        max: 10
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
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
}, {
    timestamps: true
});

// Add index for better performance
adSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
adSchema.index({ pages: 1 });

export default mongoose.models.Ad || mongoose.model('Ad', adSchema);