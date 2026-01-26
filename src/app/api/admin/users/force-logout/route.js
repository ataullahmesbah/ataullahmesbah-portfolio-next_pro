// app/api/admin/users/force-logout/route.js
import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbMongoose';

export async function POST(req) {
    try {
        await dbConnect();
        const { userId } = await req.json();

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Set force logout flag
        user.forceLogout = true;
        await user.save();

        return NextResponse.json({ message: 'User will be logged out on next request' });
    } catch (error) {
   
        return NextResponse.json({ message: 'Failed to force logout' }, { status: 500 });
    }
}