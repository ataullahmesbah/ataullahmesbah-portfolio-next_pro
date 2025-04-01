import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  mainImage: { type: String, required: true },
  shortDescriptions: [{ type: String }],
  author: { type: String, required: true },
  content: [{
    type: { type: String, enum: ['text', 'image'], required: true },
    data: { type: String, required: true },
    tag: {
      type: String,
      enum: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'image'], // Added 'image'
      required: function () {
        return this.type === 'text'; // Only required for text type
      }
    },
    bulletPoints: {
      type: [String],
      required: function () {
        return this.type === 'text'; // Only for text type
      },
      default: undefined
    },
    alt: {
      type: String,
      required: function () {
        return this.type === 'image'; // Only required for images
      }
    }
  }],
  keyPoints: [{ type: String }],
  publishDate: { type: Date, default: Date.now },
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  tags: [{ type: String }],
  categories: [{ type: String }],
  views: { type: Number, default: 0 },
  readTime: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);