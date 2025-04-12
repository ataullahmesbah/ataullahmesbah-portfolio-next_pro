import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'code'],
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        default: '',
    },
}, { _id: false });

const FeaturedStorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [120, 'Title cannot exceed 120 characters']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    metaDescription: {
        type: String,
        required: [true, 'Meta description is required'],
        maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    image: {
        type: String,
        required: [true, 'Image URL is required'],
        match: [/^https?:\/\/.+\..+/, 'Please use a valid URL']
    },
    publishedDate: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0,
        min: [0, 'Views cannot be negative']
    },
    content: {
        type: [ContentSchema],
        required: [true, 'Content is required'],
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'At least one content block is required'
        }
    },
    category: {
        type: String,
        enum: ['featured', 'tech', 'travel', 'seo', 'personal'],
        default: 'featured'
    },
    tags: {
        type: [String],
        default: [],
        validate: {
            validator: function (v) {
                return v.length <= 10;
            },
            message: 'Cannot have more than 10 tags'
        }
    },
    metaTitle: {
        type: String,
        required: [true, 'Meta title is required'],
        maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    keyPoints: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    }
}, { timestamps: true });

// Add pre-save hook for slug generation
FeaturedStorySchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

export default mongoose.models.FeaturedStory ||
    mongoose.model('FeaturedStory', FeaturedStorySchema);