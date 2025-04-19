import mongoose from 'mongoose';

const AffiliateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    affiliateCode: { type: String, unique: true, sparse: true }, // Set on approval
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Affiliate || mongoose.model('Affiliate', AffiliateSchema);