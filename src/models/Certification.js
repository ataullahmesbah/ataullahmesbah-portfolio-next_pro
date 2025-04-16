import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
    {
        niche: {
            type: String,
            required: [true, 'Niche is required'],
            enum: ['SEO', 'Developer', 'Marketing', 'Content Creation', 'Other'],
            trim: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters'],
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        issuer: {
            type: String,
            required: [true, 'Issuer is required'],
            trim: true,
            minlength: [3, 'Issuer must be at least 3 characters'],
            maxlength: [100, 'Issuer cannot exceed 100 characters'],
        },
        credentialId: {
            type: String,
            trim: true,
            maxlength: [50, 'Credential ID cannot exceed 50 characters'],
        },
        image: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true,
            match: [/^https?:\/\/res\.cloudinary\.com\/.*\.(webp)$/i, 'Image must be a valid Cloudinary WebP URL'],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export default mongoose.models.Certification || mongoose.model('Certification', certificationSchema);