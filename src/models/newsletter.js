// models/newsletter.js
import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema({
    mainImage: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    metaTitle: {
        type: String,
        required: true,
        trim: true,
    },
    metaDescription: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String, // HTML content from React Quill (paragraphs, headings, bullet points)
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    publishDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export default mongoose.models.Newsletter || mongoose.model('Newsletter', NewsletterSchema);