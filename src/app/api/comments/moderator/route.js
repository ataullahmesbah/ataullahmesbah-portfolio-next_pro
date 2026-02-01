// app/api/comments/moderator/route.js - NEW FILE
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Comment from '@/models/Comment';
import dbConnect from '@/lib/dbMongoose';


// GET pending comments - SORT BY LATEST FIRST
export async function GET(request) {
    try {
        // Check authentication and role
        const token = await getToken({ req: request });

        if (!token || !token.role) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Check if user is admin or moderator
        if (token.role !== 'admin' && token.role !== 'moderator') {
            return NextResponse.json(
                { error: 'Access denied. Moderator or Admin role required' },
                { status: 403 }
            );
        }

        await dbConnect();

        // Get unapproved parent comments - SORT BY LATEST FIRST
        const pendingComments = await Comment.find({ isApproved: false })
            .select('name email text blogId replies createdAt')
            .sort({ createdAt: -1 }) // 
            .lean();

        // Get approved parent comments with unapproved replies - SORT BY LATEST FIRST
        const commentsWithPendingReplies = await Comment.find({
            isApproved: true,
            'replies.isApproved': false
        })
            .select('name email text blogId replies createdAt')
            .sort({ createdAt: -1 }) // 
            .lean();

        // Process comments with pending replies
        const processedComments = commentsWithPendingReplies.map(comment => {
            // Sort pending replies by createdAt DESC
            const pendingReplies = comment.replies
                .filter(reply => !reply.isApproved)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return {
                ...comment,
                replies: pendingReplies
            };
        });

        // Combine both types of pending content
        const allPending = [...pendingComments, ...processedComments];

        return NextResponse.json(allPending, { status: 200 });
    } catch (error) {
        console.error('Moderator pending comments error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pending comments' },
            { status: 500 }
        );
    }
}

// PATCH: Moderator can approve comments/replies
export async function PATCH(request) {
    try {
        // Check authentication and role
        const token = await getToken({ req: request });

        if (!token || !token.role) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Check if user is admin or moderator
        if (token.role !== 'admin' && token.role !== 'moderator') {
            return NextResponse.json(
                { error: 'Access denied. Moderator or Admin role required' },
                { status: 403 }
            );
        }

        await dbConnect();
        const { commentId, replyId } = await request.json();

        if (replyId) {
            const comment = await Comment.findOne({ 'replies._id': replyId });
            if (!comment) {
                return NextResponse.json(
                    { error: 'Reply not found' },
                    { status: 404 }
                );
            }

            const replyIndex = comment.replies.findIndex(
                r => r._id.toString() === replyId
            );
            if (replyIndex === -1) {
                return NextResponse.json(
                    { error: 'Reply not found' },
                    { status: 404 }
                );
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
                return NextResponse.json(
                    { error: 'Comment not found' },
                    { status: 404 }
                );
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
        console.error('Moderator approve error:', error);
        return NextResponse.json(
            { error: 'Failed to approve' },
            { status: 500 }
        );
    }
}


export async function POST(request) {
    try {
        // Check authentication and role
        const token = await getToken({ req: request });

        if (!token || !token.role) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Check if user is admin or moderator
        if (token.role !== 'admin' && token.role !== 'moderator') {
            return NextResponse.json(
                { error: 'Access denied. Moderator or Admin role required' },
                { status: 403 }
            );
        }

        await dbConnect();

        // Get all approved parent comments with their approved replies
        // SORT BY createdAt DESC (newest first)
        const approvedComments = await Comment.find({ isApproved: true })
            .select('name email text blogId replies createdAt')
            .sort({ createdAt: -1 }) // ✅ এখানে sort করছি
            .lean();

        // Filter to only include approved replies
        const processedComments = approvedComments.map(comment => {
            // Sort replies by createdAt DESC (newest first)
            const sortedReplies = comment.replies
                .filter(reply => reply.isApproved)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return {
                ...comment,
                replies: sortedReplies
            };
        });

        return NextResponse.json(processedComments, { status: 200 });
    } catch (error) {
        console.error('Moderator approved comments error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch approved comments' },
            { status: 500 }
        );
    }
}



