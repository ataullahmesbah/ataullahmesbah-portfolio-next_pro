import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        image: { type: String }, // Profile Image
        verificationImage: { type: String }, // NID/Passport Image
        intro: { type: String, maxlength: 20 },
        bio: { type: String, maxlength: 150 },
        description: { type: String },
        verification: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, // pending, accepted, rejected
        role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
    },
    { timestamps: true }
);

export default mongoose.models.UserProfile ||
    mongoose.model('UserProfile', userProfileSchema);
