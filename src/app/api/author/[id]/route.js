// src/app/api/author/[id]/route.js
import User from '@/models/User';
import UserProfile from '@/models/UserProfile';
import dbConnect from "@/lib/dbMongoose";

export async function GET(req, { params }) {
    await dbConnect();

    try {
        // 1. Verify if the user exists in User collection
        const user = await User.findById(params.id).select('name email username');
        if (!user) {
            return NextResponse.json({ error: 'Author not found' }, { status: 404 });
        }

        // 2. Get profile info from UserProfile collection
        const profile = await UserProfile.findOne({ userId: params.id })
            .select('image intro bio description verification');

        if (!profile) {
            return NextResponse.json({ error: 'Author profile not found' }, { status: 404 });
        }

        // 3. Return author details
        return NextResponse.json({
            author: {
                name: user.name, // Name from User collection (or session if available)
                email: user.email,
                username: user.username,
                profile: profile.toObject()
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching author:', error);
        return NextResponse.json({ error: 'Server error', message: error.message }, { status: 500 });
    }
}