import dbConnect from '@/lib/dbMongoose';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';

export async function GET(request) {
    await dbConnect();

    try {
        // Get all approved parent comments with their approved replies
        const approvedComments = await Comment.find({ isApproved: true })
            .select('name email text blogId replies createdAt')
            .lean();

        // Filter to only include approved replies
        const processedComments = approvedComments.map(comment => {
            return {
                ...comment,
                replies: comment.replies.filter(reply => reply.isApproved)
            };
        });

        return NextResponse.json(processedComments, { status: 200 });
    } catch (error) {
    
        return NextResponse.json(
            { error: 'Failed to fetch approved comments' },
            { status: 500 }
        );
    }
}