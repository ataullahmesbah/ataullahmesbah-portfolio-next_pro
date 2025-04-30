import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  currency: {
    type: String,
    enum: ['BDT', 'USD', 'EUR'],
    required: true,
  },
  amount: { type: Number, required: true },
  exchangeRate: { type: Number },
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    prices: { type: [priceSchema], required: true, validate: [v => v.length > 0, 'At least one price is required'] },
    mainImage: { type: String, required: true },
    additionalImages: [{ type: String }],
    description: { type: String, required: true },
    descriptions: [{ type: String }],
    bulletPoints: [{ type: String }],
    productType: { type: String, enum: ['Own', 'Affiliate'], required: true },
    affiliateLink: { type: String },
    owner: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);