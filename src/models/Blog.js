import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  mainImage: { type: String, required: true },
  shortDescriptions: [{ type: String }], // Changed to array
  author: { type: String, required: true },
  content: [{
    type: { type: String, enum: ['text', 'image'], required: true },
    data: { type: String, required: true },
    bulletPoints: [{ type: String }], // Added for text content
    alt: { type: String } // For images
  }],
  keyPoints: [{ type: String }],
  publishDate: { type: Date, default: Date.now },
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  tags: [{ type: String }],
  categories: [{ type: String }],
  views: { type: Number, default: 0 },
  readTime: { type: Number, default: 1 },
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);