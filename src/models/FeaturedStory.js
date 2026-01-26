// src/models/FeaturedStory.js

import mongoose from 'mongoose';
import slugify from 'slugify';

const ContentBlockSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['paragraph', 'heading', 'image', 'video', 'code'],
            required: true,
        },
        level: {
            type: Number,
            min: 1,
            max: 6,
            required: function () {
                return this.type === 'heading';
            },
        },
        content: {
            type: String,
            required: function () {
                return this.type !== 'image';
            },
        },
        imageUrl: {
            type: String,
            required: function () {
                return this.type === 'image';
            },
        },
        alt: {
            type: String,
            default: '',
            maxlength: [125, 'ALT text cannot exceed 125 characters'],
        },
        caption: {
            type: String,
            default: '',
        },
    },
    { _id: false }
);

const FeaturedStorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [120, 'Title cannot exceed 120 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        metaDescription: {
            type: String,
            required: [true, 'Meta description is required'],
            maxlength: [160, 'Meta description cannot exceed 160 characters'],
        },
        shortDescription: {
            type: String,
            required: [true, 'Short description is required'],
            maxlength: [300, 'Short description cannot exceed 300 characters'],
        },
        mainImage: {
            type: String,
            required: [true, 'Main image URL is required'],
        },
        mainImageAlt: {
            type: String,
            default: '',
            maxlength: [125, 'ALT text cannot exceed 125 characters'],
        },
        publishedDate: {
            type: Date,
            default: Date.now,
        },
        views: {
            type: Number,
            default: 0,
            min: [0, 'Views cannot be negative'],
        },
        contentBlocks: {
            type: [ContentBlockSchema],
            required: [true, 'Content blocks are required'],
            validate: {
                validator: function (v) {
                    return v.length > 0;
                },
                message: 'At least one content block is required',
            },
        },
        category: {
            type: String,
            default: 'featured',
            trim: true,
            lowercase: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        metaTitle: {
            type: String,
            required: [true, 'Meta title is required'],
            maxlength: [60, 'Meta title cannot exceed 60 characters'],
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
        },
        keyPoints: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
        },
        readingTime: {
            type: Number,
            default: 5,
            min: [1, 'Reading time must be at least 1 minute'],
        },
    },
    { timestamps: true }
);

// Pre-save hook for slug generation and reading time calculation
FeaturedStorySchema.pre('save', function (next) {
    // Only generate slug if it doesn't exist or is being modified
    if (!this.slug || this.isModified('title')) {
        const baseSlug = slugify(this.title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });

        // Set the base slug without timestamp
        this.slug = baseSlug;
    }

    // Calculate reading time from content blocks
    if (this.isModified('contentBlocks')) {
        let totalWords = 0;
        this.contentBlocks.forEach(block => {
            if (['paragraph', 'heading'].includes(block.type) && block.content) {
                const words = block.content.split(/\s+/).length;
                totalWords += words;
            }
        });
        this.readingTime = Math.max(1, Math.ceil(totalWords / 200));
    }

    next();
});

// Index for better query performance

FeaturedStorySchema.index({ category: 1 });
FeaturedStorySchema.index({ status: 1 });
FeaturedStorySchema.index({ publishedDate: -1 });

export default mongoose.models.FeaturedStory ||
    mongoose.model('FeaturedStory', FeaturedStorySchema);