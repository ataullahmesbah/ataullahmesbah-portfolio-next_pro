import mongoose from 'mongoose';

// Ensure mongoose is loaded
if (!mongoose) {
  throw new Error('Mongoose is not loaded');
}

const BlockedIPSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  reason: { type: String, default: 'Suspicious activity' },
  blockedAt: { type: Date, default: Date.now },
  blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.models?.BlockedIP || mongoose.model('BlockedIP', BlockedIPSchema);