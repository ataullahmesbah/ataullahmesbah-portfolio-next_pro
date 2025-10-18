// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },

    // NEW FIELDS ADDED
    lastLogin: { type: Date },
    lastLoginIP: { type: String },
    loginHistory: {
        type: [{
            timestamp: { type: Date, default: Date.now },
            ip: { type: String },
            userAgent: { type: String }
        }],
        default: [] // ✅ IMPORTANT: Set default empty array
    },
    forceLogout: { type: Boolean, default: false },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    image: { type: String },
});

// Update the updatedAt field before saving
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);