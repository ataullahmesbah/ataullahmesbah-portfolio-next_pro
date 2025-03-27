// src/models/newsletter.js
import mongoose from 'mongoose';

// Slug generation helper
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
        .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
};

const newsletterSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    metaTitle: { type: String, required: true, trim: true },
    metaDescription: {
        type: String,
        required: true,
        trim: true,
        maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    description: { type: String, required: true, trim: true },
    content: [
        {
            content: { type: String, required: true },
            tag: { type: String, enum: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'], default: 'p' },
            bulletPoints: [{ type: String }], // Optional bullet points
        },
    ],
    category: { type: String, required: true, trim: true },
    mainImage: { type: String, required: true },
    imageAlt: { type: String, required: true, trim: true },
    gallery: [
        {
            url: { type: String, required: true },
            name: { type: String },
            alt: { type: String },
        },
    ],
    author: { type: String, required: true, trim: true },
    views: { type: Number, default: 0 },
    publishDate: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Pre-save hook to generate slug and ensure uniqueness
newsletterSchema.pre('save', async function (next) {
    if (this.isModified('title') || !this.slug) {
        let baseSlug = generateSlug(this.title);
        let slug = baseSlug;
        let counter = 1;

        while (await mongoose.models.Newsletter.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }
    this.updatedAt = Date.now();
    next();
});

export default mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);