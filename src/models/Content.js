import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    platform: { type: String, enum: ['YouTube', 'Facebook'], required: true },
    date: { type: Date, default: Date.now },
});

export default mongoose.models.Content || mongoose.model('Content', contentSchema);