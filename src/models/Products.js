import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  currency: { type: String, required: true, enum: ['BDT', 'USD', 'EUR'] },
  amount: { type: Number, required: true },
  exchangeRate: { type: Number },
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  prices: [priceSchema],
  mainImage: { type: String, required: true },
  additionalImages: [{ type: String }],
  description: { type: String, required: true },
  descriptions: [{ type: String }],
  bulletPoints: [{ type: String }],
  productType: { type: String, required: true, enum: ['Own', 'Affiliate'] },
  affiliateLink: { type: String },
  owner: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);