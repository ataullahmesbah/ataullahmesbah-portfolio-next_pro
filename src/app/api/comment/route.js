import dbConnect from '@/lib/dbMongoose';
import Comment from '@/models/Comment';
import express from 'express';


const router = express.Router();

// ✅ Get Comments for a Blog
router.get('/comments/:blogId', async (req, res) => {
    try {
        await dbConnect(); // Connect to DB
        const comments = await Comment.find({ blogId: req.params.blogId }).populate('userId', 'name');
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ✅ Post a Comment (User Must Be Logged In)
router.post('/comment/:blogId', verifyUser, async (req, res) => {
    try {
        await dbConnect(); // Connect to DB
        const { comment } = req.body;
        const newComment = new Comment({
            blogId: req.params.blogId,
            userId: req.user.id, // From verifyUser middleware
            comment
        });
        await newComment.save();
        res.json({ message: 'Comment added successfully' });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
