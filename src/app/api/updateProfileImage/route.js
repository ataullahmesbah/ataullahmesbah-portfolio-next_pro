import dbConnect from '@/lib/dbMongoose';
import User from '@/models/User';
import { NextResponse } from 'next/server';



export async function POST(req) {
    await dbConnect();

    try {
        const { email, image } = await req.json();
        console.log('Updating profile image for:', email, 'with URL:', image);

        // Find the user by email and update the image field
        const user = await User.findOneAndUpdate(
            { email },
            { image },
            { new: true } // Return the updated document
        );

        console.log('Updated user:', user);
        return NextResponse.json(user, { status: 200 });
    } catch (err) {
        console.error('Error updating profile image:', err);
        return NextResponse.json({ message: 'Failed to update profile image' }, { status: 500 });
    }
}