import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: [100, 'Title cannot exceed 100 characters'] },
  slug: { type: String, required: [true, 'Slug is required'], unique: true, trim: true },
  mainImage: { type: String, required: [true, 'Main image is required'] },
  shortDescription: { type: String, required: [true, 'Short description is required'], trim: true, maxlength: [200, 'Short description cannot exceed 200 characters'] },
  author: { type: String, required: true, trim: true },
  content: [
    {
      type: { type: String, required: [true, 'Content type is required'], enum: ['text', 'image'] },
      data: { type: String, required: [true, 'Content data is required'] },
      alt: { type: String, trim: true }
    }
  ],
  keyPoints: [{ type: String, trim: true }],
  publishDate: { type: Date, required: [true, 'Publish date is required'], default: Date.now },
  metaTitle: { type: String, required: [true, 'Meta title is required'], trim: true, maxlength: [100, 'Meta title cannot exceed 100 characters'] },
  metaDescription: { type: String, required: [true, 'Meta description is required'], trim: true, maxlength: [160, 'Meta description cannot exceed 160 characters'] },
  tags: [{ type: String, trim: true }],
  categories: [{ type: String, trim: true }],
  views: { type: Number, default: 0 },
  readTime: { type: Number, default: 1, min: [1, 'Read time must be at least 1 minute'] },
}, { timestamps: true });


export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);