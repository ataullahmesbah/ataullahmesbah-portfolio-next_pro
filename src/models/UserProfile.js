import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        image: { type: String }, // Profile image (Cloudinary URL)
        verificationImage: { type: String }, // NID/Passport image
        verification: { type: String, enum: ['not_applied', 'pending', 'accepted', 'rejected'], default: 'not_applied' },
        displayName: { type: String },
        title: { type: String, maxlength: 50 }, // e.g., Full Stack Developer
        location: { type: String, maxlength: 100 }, // e.g., Dhaka, Bangladesh
        expertise: [{ type: String }], // e.g., ["React", "Node.js"]
        bio: { type: String, minlength: 380, maxlength: 1000 }, // Updated to min 380, max 1000
        portfolio: [
            {
                title: { type: String, required: true }, // e.g., Project X
                sectors: [{ type: String }], // e.g., ["Web Development", "SEO"]
                _id: false,
            },
        ],
        experience: [{ type: String }], // e.g., ["Senior Developer", "Freelancer"]
        workAvailability: [{ type: String, enum: ['full-time', 'part-time', 'remote', 'onsite'] }], // e.g., ["full-time", "remote"]
        workExperience: [
            {
                companyName: { type: String, required: true }, // e.g., Tech Corp
                designation: { type: String, required: true }, // e.g., Senior Developer
                roles: [{ type: String }], // e.g., ["Frontend", "Backend"]
                startDate: { type: Date, required: true },
                endDate: { type: Date }, // Optional (null for "Present")
                _id: false,
            },
        ],
        education: [
            {
                degree: { type: String, required: true }, // e.g., BSc in CSE
                instituteName: { type: String, required: true }, // e.g., DU
                location: { type: String, required: true }, // e.g., Dhaka
                startDate: { type: Date, required: true },
                endDate: { type: Date }, // Optional (null for "Present")
                _id: false,
            },
        ],
        skills: [
            {
                title: { type: String, required: true }, // e.g., Programming
                skills: [{ type: String }], // e.g., ["JavaScript", "Python"]
                _id: false,
            },
        ],
        socialLinks: {
            twitter: { type: String, default: '' }, // Optional
            linkedin: { type: String, default: '' }, // Optional
        },
    },
    { timestamps: true }
);

export default mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);