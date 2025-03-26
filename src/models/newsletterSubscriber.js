// src/models/newsletterSubscriber.js
import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    name: {
        type: String,
        trim: true
    },
    brevoSynced: {
        type: Boolean,
        default: false
    },
    brevoSyncedAt: {
        type: Date
    },
    retryAttempts: {
        type: Number,
        default: 0
    },
    lastError: {
        type: String
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        default: 'unknown'
    },
    country: {
        type: String,
        default: 'Unknown'
    }
});

export default mongoose.models.NewsletterSubscriber ||
    mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);