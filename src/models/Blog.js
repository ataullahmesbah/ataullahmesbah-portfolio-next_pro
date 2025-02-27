// models/Blog.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortContent: { type: String, required: true },
    image: { type: String, required: true },
    content: [
        {
            type: { type: String, enum: ['text', 'image'], required: true },
            data: { type: String, required: true },
            alt: { type: String } // For images
        }
    ],
    author: { type: String, required: true },
    publishDate: { type: Date, default: Date.now },
    category: { type: String, required: true },
    keyPoints: [{ type: String }],
    highlightPoints: [{ type: String }],
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    tags: [{ type: String }],
    images: [
        {
            url: { type: String, required: true },
            alt: { type: String, required: true }
        }
    ],
    comments: [commentSchema] // Embedded comments
});

module.exports = mongoose.model('Blog', blogSchema);