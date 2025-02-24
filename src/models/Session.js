import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    sessionToken: { type: String, required: true },
    expires: { type: Date, required: true },
});

export default mongoose.models.Session || mongoose.model('Session', sessionSchema);