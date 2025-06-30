import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    text: {
        type: String,
        required: true,
        minlength: [10, 'Comment must be at least 10 characters long']
    },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const CommentSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    text: {
        type: String,
        required: true,
        minlength: [10, 'Comment must be at least 10 characters long']
    },
    isApproved: { type: Boolean, default: false },
    replies: [ReplySchema],
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);