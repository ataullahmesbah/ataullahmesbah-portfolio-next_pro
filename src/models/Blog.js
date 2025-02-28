// models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    mainImage: { type: String, required: true },
    shortDescription: { type: String, required: true },
    author: { type: String, required: true },
    content: [
        {
            type: { type: String, required: true },
            data: { type: String, required: true },
            alt: { type: String, required: false },
        },
    ],
    keyPoints: [{ type: String }],
    publishDate: { type: Date, required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    tags: [{ type: String }],
    categories: [{ type: String }], // Ensure this field is included
    auth: { type: String, required: true },
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);