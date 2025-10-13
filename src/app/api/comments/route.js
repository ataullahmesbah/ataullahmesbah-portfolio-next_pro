//api/comments/route.js

import { NextResponse } from 'next/server';
import Comment from '@/models/Comment';
import dbConnect from '@/lib/dbMongoose';

// Common error responses
const missingFieldsError = NextResponse.json(
    { error: 'All fields are required' },
    { status: 400 }
);

const notFoundError = (entity) =>
    NextResponse.json(
        { error: `${entity} not found` },
        { status: 404 }
    );

const serverError = (action) =>
    NextResponse.json(
        { error: `Failed to ${action}` },
        { status: 500 }
    );

// GET: Fetch approved comments for a specific blog
export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blogId');

    if (!blogId) {
        return NextResponse.json(
            { error: 'Blog ID is required' },
            { status: 400 }
        );
    }

    try {
        const comments = await Comment.find({
            blogId,
            isApproved: true
        })
            .select('name email text replies createdAt')
            .lean();

        const filteredComments = comments.map(comment => ({
            ...comment,
            replies: comment.replies.filter(reply => reply.isApproved)
        }));

        return NextResponse.json(filteredComments, { status: 200 });
    } catch (error) {

        return serverError('fetch comments');
    }
}

// POST: Create a new comment or reply
export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const { blogId, name, email, text, parentCommentId } = body;

        if (!blogId || !name || !email || !text) {
            return missingFieldsError;
        }

        if (text.length < 10) {
            return NextResponse.json(
                { error: 'Comment must be at least 10 characters long' },
                { status: 400 }
            );
        }

        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                return notFoundError('Parent comment');
            }

            parentComment.replies.push({ name, email, text });
            await parentComment.save();
            return NextResponse.json(
                { message: 'Reply submitted for approval' },
                { status: 201 }
            );
        } else {
            const comment = new Comment({ blogId, name, email, text });
            await comment.save();
            return NextResponse.json(
                { message: 'Comment submitted for approval' },
                { status: 201 }
            );
        }
    } catch (error) {

        return serverError('submit comment');
    }
}

// PATCH: Approve a comment or reply
export async function PATCH(request) {
    await dbConnect();
    try {
        const { commentId, replyId } = await request.json();

        if (replyId) {
            const comment = await Comment.findOne({ 'replies._id': replyId });
            if (!comment) {
                return notFoundError('Reply');
            }

            const replyIndex = comment.replies.findIndex(
                r => r._id.toString() === replyId
            );
            if (replyIndex === -1) {
                return notFoundError('Reply');
            }

            comment.replies[replyIndex].isApproved = true;
            await comment.save();
            return NextResponse.json(
                { message: 'Reply approved successfully' },
                { status: 200 }
            );
        }

        if (commentId) {
            const comment = await Comment.findByIdAndUpdate(
                commentId,
                { isApproved: true },
                { new: true }
            );
            if (!comment) {
                return notFoundError('Comment');
            }
            return NextResponse.json(
                { message: 'Comment approved successfully' },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: 'Comment or reply ID required' },
            { status: 400 }
        );
    } catch (error) {

        return serverError('approve comment');
    }
}

// DELETE: Delete a comment or reply
export async function DELETE(request) {
    await dbConnect();
    try {
        const { commentId, replyId } = await request.json();

        if (replyId) {
            const comment = await Comment.findOne({ 'replies._id': replyId });
            if (!comment) {
                return notFoundError('Reply');
            }

            comment.replies = comment.replies.filter(
                r => r._id.toString() !== replyId
            );
            await comment.save();
            return NextResponse.json(
                { message: 'Reply deleted successfully' },
                { status: 200 }
            );
        }

        if (commentId) {
            const result = await Comment.findByIdAndDelete(commentId);
            if (!result) {
                return notFoundError('Comment');
            }
            return NextResponse.json(
                { message: 'Comment deleted successfully' },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: 'Comment or reply ID required' },
            { status: 400 }
        );
    } catch (error) {

        return serverError('delete comment');
    }
}