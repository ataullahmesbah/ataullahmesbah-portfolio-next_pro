import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        maxlength: [100, 'User name cannot exceed 100 characters']
    },
    user_position: {
        type: String,
        trim: true,
        default: 'Customer',
        maxlength: [100, 'Position cannot exceed 100 characters']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        validate: {
            validator: function(v) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(v);
            },
            message: props => `${props.value} is not a valid image URL`
        }
    },
    categories: {
        type: [String],
        required: [true, 'At least one category is required'],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'At least one category is required'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add text index for search functionality
TestimonialSchema.index({
    user_name: 'text',
    user_position: 'text',
    description: 'text',
    categories: 'text'
});

const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

export default Testimonial;