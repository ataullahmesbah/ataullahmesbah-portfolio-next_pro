// api/profile/public-profile/[username]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import User from '@/models/User';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { username } = params;

    const user = await User.findOne({ username })
      .select('username email displayName createdAt');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const profile = await UserProfile.findOne({ userId: user._id })
      .lean();

    return NextResponse.json({
      profile: profile || null,
      user: {
        username: user.username,
        displayName: user.displayName || user.username,
        memberSince: user.createdAt
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}