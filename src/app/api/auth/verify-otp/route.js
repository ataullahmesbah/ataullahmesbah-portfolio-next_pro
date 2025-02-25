import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbMongoose';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, otp } = await req.json();

        // Find the user with the matching email and OTP
        const user = await User.findOne({ email, otp });
        if (!user) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        // Check if OTP has expired
        if (new Date() > new Date(user.otpExpiresAt)) {
            return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
        }

        // Activate the user
        user.status = 'active';
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
    } catch (error) {
        console.error('OTP Verification error:', error);
        return NextResponse.json({ message: 'OTP verification failed' }, { status: 500 });
    }
}