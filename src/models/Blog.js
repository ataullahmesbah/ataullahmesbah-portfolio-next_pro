import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  mainImage: { type: String, required: true },
  shortDescription: { type: String, required: true },
  author: { type: String, required: true },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: [
    {
      type: { type: String, required: true }, // 'text' or 'image'
      data: { type: String, required: true }, // Text content or image URL
      alt: { type: String, required: false }, // Alt text for images
    },
  ],
  keyPoints: [{ type: String }],
  publishDate: { type: Date, required: true },
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  tags: [{ type: String }],
  categories: [{ type: String }],
  auth: { type: String, required: true },
  views: { type: Number, default: 0 },
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);