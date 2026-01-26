
import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';

export async function POST(req) {
    await dbConnect();

    try {
        const { userId, image, intro, bio, description } = await req.json();



        const profile = await UserProfile.findOneAndUpdate(
            { userId },
            { image, intro, bio, description },
            { new: true, upsert: true } // upsert true dile jodi data na thake taile create korbe
        );


        return NextResponse.json(profile, { status: 200 });
    } catch (err) {

        return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
    }
}
