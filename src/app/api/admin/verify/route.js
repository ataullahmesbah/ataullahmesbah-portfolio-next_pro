import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';


export async function POST(request) {
    await dbConnect();
    const { userId, status } = await request.json();
    const user = await UserProfile.findOne({ userId });

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.verified = status;
    await user.save();
    return NextResponse.json({ message: 'Verification status updated', user });
}