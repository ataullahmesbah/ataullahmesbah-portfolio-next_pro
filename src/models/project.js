// src/models/project.js
import mongoose from 'mongoose';

// Slug generation helper
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
        .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
};

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    contentShort: {
        type: String,
        required: true,
        maxlength: [250, 'Short description cannot exceed 250 characters']
    },
    content: [
        {
            content: { type: String, required: true },
            tag: { type: String, enum: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'], default: 'p' },
            bulletPoints: [{ type: String }],
        },
    ],
    category: { type: String, required: true }, // Removed enum to allow dynamic categories
    mainImage: { type: String, required: true },
    imageAlt: { type: String, required: true },
    gallery: [
        {
            url: { type: String, required: true },
            name: { type: String },
            alt: { type: String },
        },
    ],
    keyPoints: [{ type: String }],
    websiteFeatures: [{ type: String }],
    supportSystem: { type: String },
    metaDescription: { type: String, required: true },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to generate slug and ensure uniqueness
projectSchema.pre('save', async function (next) {
    console.log("Gallery data in pre-save hook:", this.gallery); // Debug log
    if (this.isModified('title') || !this.slug) {
        let baseSlug = generateSlug(this.title);
        let slug = baseSlug;
        let counter = 1;

        while (await mongoose.models.Project.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
    }
    next();
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);