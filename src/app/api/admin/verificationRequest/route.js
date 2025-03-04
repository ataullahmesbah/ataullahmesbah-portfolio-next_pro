import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';


export async function GET() {
    await dbconnect();
    const pendingRequests = await UserProfile.find({ verification: 'pending' });
    return NextResponse.json(pendingRequests);
}

export async function PUT(req) {
    await dbConnect();
    const { userId, status } = await req.json();

    await UserProfile.findOneAndUpdate(
        { userId },
        { verification: status }
    );

    return NextResponse.json({ success: true });
}
