import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';


export async function GET(req, { params }) {
    try {
        await dbConnect();
        const { userId } = params;

        // Validate userId format if needed
        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json(
                { message: 'Invalid user ID format' },
                { status: 400 }
            );
        }

        const [profile, user] = await Promise.all([
            UserProfile.findOne({ userId }).lean(),
            User.findById(userId).select('username email createdAt').lean()
        ]);

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            profile: profile || null,
            user: {
                username: user.username,
                email: user.email,
                memberSince: user.createdAt,
            },
        });
    } catch (error) {
   
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}