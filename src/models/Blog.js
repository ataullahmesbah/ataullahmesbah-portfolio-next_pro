import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  mainImage: { type: String, required: true },
  shortDescriptions: [{ type: String }],
  author: { type: String, required: true },
  content: [{
    type: {
      type: String,
      enum: ['text', 'image', 'link'],
      required: true
    },
    data: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (this.type === 'text') {
            // Allow markdown syntax like [text](url) in text content
            return v && v.trim().length > 0;
          }
          return true;
        },
        message: 'Text content cannot be empty'
      }
    },
    tag: {
      type: String,
      enum: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'image', 'a'],
      required: function () {
        return this.type === 'text' || this.type === 'link';
      }
    },
    bulletPoints: {
      type: [String],
      required: function () {
        return this.type === 'text';
      },
      default: undefined
    },
    alt: {
      type: String,
      required: function () {
        return this.type === 'image';
      }
    },
    href: {
      type: String,
      required: function () {
        return this.type === 'link';
      }
    },
    target: {
      type: String,
      enum: ['_blank', '_self', '_parent', '_top'],
      default: '_blank'
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
  //  Add this status field
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  structuredData: { type: String },
  faqs: [{
    question: { type: String },
    answer: { type: String }
  }],
  lsiKeywords: [{ type: String }],
  semanticRelatedTerms: [{ type: String }],
  geoLocation: {
    targetCountry: { type: String },
    targetCity: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  language: { type: String, default: 'en' },
  sgeOptimized: { type: Boolean, default: false },
  conversationalPhrases: [{ type: String }],
  directAnswers: [{
    question: { type: String },
    answer: { type: String }
  }],
  expertAuthor: { type: Boolean, default: false },
  authorCredentials: { type: String },
  citations: [{
    source: { type: String },
    link: { type: String }
  }]
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);