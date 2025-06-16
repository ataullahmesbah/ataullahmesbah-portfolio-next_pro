// portfolio/src/models/Chat.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true, enum: ['user', 'admin'] },
  content: { type: String, required: true, trim: true, maxlength: 1000 },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  status: { type: String, enum: ['pending', 'active', 'closed'], default: 'pending' },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now, expires: '7d' },
  updatedAt: { type: Date, default: Date.now },
});

ChatSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);