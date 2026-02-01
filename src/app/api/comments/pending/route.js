//api/comments/pending/route.js

import dbConnect from '@/lib/dbMongoose';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';


export async function GET(request) {
  await dbConnect();

  try {

    const pendingComments = await Comment.find({ isApproved: false })
      .select('name email text blogId replies createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Get approved parent comments with unapproved replies
    const commentsWithPendingReplies = await Comment.find({
      isApproved: true,
      'replies.isApproved': false
    })
      .select('name email text blogId replies createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Process comments with pending replies (sort replies by latest)
    const processedComments = commentsWithPendingReplies.map(comment => {
      return {
        ...comment,
        replies: comment.replies
          .filter(reply => !reply.isApproved)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      };
    });

    // Combine both types of pending content
    const allPending = [...pendingComments, ...processedComments];

    return NextResponse.json(allPending, { status: 200 });
  } catch (error) {
    console.error('Fetch pending comments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending comments' },
      { status: 500 }
    );
  }
}