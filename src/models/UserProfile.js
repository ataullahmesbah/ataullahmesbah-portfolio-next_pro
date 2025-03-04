import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true },
        image: { type: String }, // Profile Image
        verificationImage: { type: String }, // NID/Passport Image
        intro: { type: String, maxlength: 20 },
        bio: { type: String, maxlength: 150 },
        description: { type: String },
        verification: { type: String, default: 'pending' }, // pending, accepted, rejected
        role: { type: String, default: 'user' }, // user, moderator, admin
    },
    { timestamps: true }
);

export default mongoose.models.UserProfile ||
    mongoose.model('UserProfile', userProfileSchema);
