import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';


export async function POST(req) {
    await dbConnect();

    try {
        const { userId, image, intro, bio, description } = await req.json();
        console.log('Updating profile for:', userId);

        // Find the user profile by userId and update it
        const userProfile = await UserProfile.findOneAndUpdate(
            { userId },
            { image, intro, bio, description },
            { new: true, upsert: true } // Create the document if it doesn't exist
        );

        if (!userProfile) {
            console.error('User profile not found or could not be created');
            return NextResponse.json({ message: 'User profile not found or could not be created' }, { status: 404 });
        }

        console.log('Updated user profile:', userProfile);
        return NextResponse.json(userProfile, { status: 200 });
    } catch (err) {
        console.error('Error updating profile:', err);
        return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
    }
}