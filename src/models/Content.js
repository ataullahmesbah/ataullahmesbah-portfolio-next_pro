// src/models/Content.js

import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    link: { type: String, required: true }, // YouTube or Facebook video URL
    platform: { type: String, enum: ['YouTube', 'Facebook'], required: true },
    date: { type: Date, default: Date.now },
});

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);