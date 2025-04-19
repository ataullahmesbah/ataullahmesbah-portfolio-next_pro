import mongoose from 'mongoose';

const AffiliateTransactionSchema = new mongoose.Schema({
    affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    amount: { type: Number, required: true }, // Purchase amount
    commission: { type: Number, required: true }, // 8% of amount
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AffiliateTransaction || mongoose.model('AffiliateTransaction', AffiliateTransactionSchema);