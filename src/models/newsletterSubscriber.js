// src/models/newsletterSubscriber.js
import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    name: {
        type: String,
        trim: true,
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.NewsletterSubscriber || mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);