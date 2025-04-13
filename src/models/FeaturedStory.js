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
            default: function () { // Add default function
                return slugify(this.title, { lower: true, strict: true });
            }
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
            match: [/^https?:\/\/.+\..+/, 'Please use a valid URL'],
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
            enum: ['featured', 'tech', 'travel', 'seo', 'personal'],
            default: 'featured',
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
            type: String,  // Changed from ObjectId to String
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
    },
    { timestamps: true }
);

// Improved slug generation
FeaturedStorySchema.pre('save', function (next) {
    if (!this.slug || this.isModified('title')) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });
    }
    next();
});

export default mongoose.models.FeaturedStory ||
    mongoose.model('FeaturedStory', FeaturedStorySchema);