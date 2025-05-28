import mongoose from 'mongoose';

const AffiliateVisitSchema = new mongoose.Schema({
    affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
    affiliateCode: { type: String, required: true },
    visitedPage: { type: String, required: true },
    visitorIp: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AffiliateVisit || mongoose.model('AffiliateVisit', AffiliateVisitSchema);