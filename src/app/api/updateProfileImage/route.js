
import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await dbConnect();

    try {
        const { userId, image, intro, bio, description } = await req.json();

        console.log('Updating profile for:', userId);

        const profile = await UserProfile.findOneAndUpdate(
            { userId },
            { image, intro, bio, description },
            { new: true, upsert: true } // upsert true dile jodi data na thake taile create korbe
        );

        console.log('Updated Profile:', profile);
        return NextResponse.json(profile, { status: 200 });
    } catch (err) {
        console.error('Error updating profile:', err);
        return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
    }
}
