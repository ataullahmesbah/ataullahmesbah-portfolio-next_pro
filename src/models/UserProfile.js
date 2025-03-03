import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    image: { type: String },
    intro: { type: String, maxlength: 20 },
    bio: { type: String, maxlength: 150 },
    description: { type: String },
});

export default mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);