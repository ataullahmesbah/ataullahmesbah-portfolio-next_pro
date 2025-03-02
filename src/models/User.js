import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' }, // Add 'moderator'
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    createdAt: { type: Date, default: Date.now },
    image: String,
});

export default mongoose.models.User || mongoose.model('User', userSchema);