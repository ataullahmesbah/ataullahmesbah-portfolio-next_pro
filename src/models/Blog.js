// src>models>Blog.js

import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    content: { type: String, required: true },
    author: { type: String, required: true },
    categories: { type: [String], required: true },
    tags: { type: [String] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    image: { type: String },
    views: { type: Number, default: 0 },
    slug: { type: String, unique: true, required: true },
    metadata: {
        title: String,
        description: String,
    }
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
