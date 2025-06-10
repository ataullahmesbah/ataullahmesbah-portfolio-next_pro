import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    sender: { type: String, required: true, enum: ['user', 'admin'] },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'accepted', 'closed'], default: 'pending' },
    messages: [MessageSchema],
    createdAt: { type: Date, default: Date.now, expires: '7d' },
});

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);