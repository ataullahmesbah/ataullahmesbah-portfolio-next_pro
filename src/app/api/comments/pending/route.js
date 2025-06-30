//api/comments/pending/route.js

import dbConnect from '@/lib/dbMongoose';
import Comment from '@/models/Comment';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();

  try {
    // Get unapproved parent comments
    const pendingComments = await Comment.find({ isApproved: false })
      .select('name email text blogId replies createdAt')
      .lean();

    // Get approved parent comments with unapproved replies
    const commentsWithPendingReplies = await Comment.find({
      isApproved: true,
      'replies.isApproved': false
    })
      .select('name email text blogId replies createdAt')
      .lean();

    // Process comments with pending replies
    const processedComments = commentsWithPendingReplies.map(comment => {
      return {
        ...comment,
        replies: comment.replies.filter(reply => !reply.isApproved)
      };
    });

    // Combine both types of pending content
    const allPending = [...pendingComments, ...processedComments];

    return NextResponse.json(allPending, { status: 200 });
  } catch (error) {
    console.error('Error fetching pending comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending comments' },
      { status: 500 }
    );
  }
}