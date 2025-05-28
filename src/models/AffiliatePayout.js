import mongoose from 'mongoose';

const AffiliatePayoutSchema = new mongoose.Schema({
    affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
});

export default mongoose.models.AffiliatePayout || mongoose.model('AffiliatePayout', AffiliatePayoutSchema);