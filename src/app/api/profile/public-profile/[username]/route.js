import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import User from '@/models/User';

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { username } = params;

        // Find user by username
        const user = await User.findOne({ username }).select('_id username email createdAt displayName');
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Find profile
        const profile = await UserProfile.findOne({ userId: user._id })
            .select('-verification -socialLinks._id -workExperience._id -education._id -portfolio._id -skills._id')
            .lean();

        return NextResponse.json({
            profile: profile || null,
            user: {
                username: user.username,
                displayName: user.displayName,
                email: user.email, // Only include if needed for public profile
                memberSince: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Error fetching public profile:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}