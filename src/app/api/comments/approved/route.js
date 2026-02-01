// app/api/comments/approved/route.js

import dbConnect from '@/lib/dbMongoose';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';




export async function GET(request) {
    await dbConnect();

    try {

        const approvedComments = await Comment.find({ isApproved: true })
            .select('name email text blogId replies createdAt')
            .sort({ createdAt: -1 })
            .lean();

        // Filter to only include approved replies (sorted by latest)
        const processedComments = approvedComments.map(comment => {
            return {
                ...comment,
                replies: comment.replies
                    .filter(reply => reply.isApproved)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            };
        });

        return NextResponse.json(processedComments, { status: 200 });
    } catch (error) {
        console.error('Fetch approved comments error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch approved comments' },
            { status: 500 }
        );
    }
}