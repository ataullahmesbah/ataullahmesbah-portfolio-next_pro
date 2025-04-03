// src/models/Travel.js
import mongoose from 'mongoose';

const TravelSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, default: Date.now },
    category: { type: String, enum: ['Journey', 'Historical', 'Gallery'], required: true },
}, {
    // Ensure only one Journey entry
    indexes: [{ key: { category: 1 }, unique: true, partialFilterExpression: { category: 'Journey' } }]
});

export default mongoose.models.Travel || mongoose.model('Travel', TravelSchema);