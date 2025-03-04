import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';


export async function GET(request) {
    await dbConnect();
    const users = await UserProfile.find({ verified: 'pending' });
    return NextResponse.json({ users });
}

export async function PUT(request) {
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

export async function DELETE(request) {
    await dbConnect();
    const { userId } = await request.json();
    await UserProfile.findOneAndDelete({ userId });
    return NextResponse.json({ message: 'User Deleted' });
}