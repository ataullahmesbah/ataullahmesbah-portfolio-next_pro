// src/app/api/auth/user/route.js
import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbMongoose';

export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();

        // Find the user by email
        const user = await User.findOne({ email }, { username: 1 }); // Only fetch the username
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ name: user.username });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ message: 'Failed to fetch user' }, { status: 500 });
    }
}