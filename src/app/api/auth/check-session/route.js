// app/api/auth/check-session/route.js
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbMongoose';
import User from '@/models/User';

export async function POST(req) {
    try {
        await dbConnect();

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({
                valid: false,
                message: 'User ID required'
            }, { status: 400 });
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({
                valid: false,
                message: 'User not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            valid: true,
            forceLogout: user.forceLogout || false,
            status: user.status,
            role: user.role
        });

    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json({
            valid: false,
            message: 'Session check failed'
        }, { status: 500 });
    }
}