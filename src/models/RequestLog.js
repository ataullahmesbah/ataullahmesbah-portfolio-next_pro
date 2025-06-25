import mongoose from 'mongoose';

// Ensure mongoose is loaded
if (!mongoose) {
  throw new Error('Mongoose is not loaded');
}

const RequestLogSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

// Add TTL index to auto-delete logs after 7 days
RequestLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7 * 24 * 3600 });

export default mongoose.models?.RequestLog || mongoose.model('RequestLog', RequestLogSchema);