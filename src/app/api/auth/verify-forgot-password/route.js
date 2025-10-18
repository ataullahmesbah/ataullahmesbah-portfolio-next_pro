// app/api/auth/verify-forgot-password/route.js
import dbConnect from '@/lib/dbMongoose';
import User from '@/models/User';
import { NextResponse } from 'next/server';


export async function POST(req) {
    try {
        await dbConnect();
        const { email, otp } = await req.json();

        // Find the user with matching email and OTP
        const user = await User.findOne({
            email: email.toLowerCase(),
            otp: otp
        });

        if (!user) {
            return NextResponse.json({ message: 'Invalid verification code' }, { status: 400 });
        }

        // Check if OTP has expired
        if (new Date() > new Date(user.otpExpiresAt)) {
            return NextResponse.json({ message: 'Verification code has expired' }, { status: 400 });
        }

        return NextResponse.json({
            message: 'Email verified successfully',
            verified: true
        });
    } catch (error) {
        console.error('Verify forgot password error:', error);
        return NextResponse.json({ message: 'Failed to verify code' }, { status: 500 });
    }
}