import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import cloudinary from '@/utils/cloudinary';
import { NextResponse } from 'next/server';


export async function POST(request) {
    await dbConnect();
    const { userId, document } = await request.json();
    const user = await UserProfile.findOne({ userId });

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.document = document;
    user.verified = 'pending';
    await user.save();
    return NextResponse.json({ message: 'Verification request submitted', user });
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
    return NextResponse.json({ message: 'User verification status updated', user });
}

export async function DELETE(request) {
    await dbConnect();
    const { userId } = await request.json();
    await UserProfile.findOneAndDelete({ userId });
    return NextResponse.json({ message: 'User deleted' });
}