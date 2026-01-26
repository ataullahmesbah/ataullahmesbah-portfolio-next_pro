// api/auth/verify-otp/route.js

import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbMongoose';


export async function POST(req) {
    try {
        await dbConnect();
        const { email, otp } = await req.json();

        // Find the user with the matching email
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user || user.otp !== otp) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        // Check if OTP has expired
        if (new Date() > new Date(user.otpExpiresAt)) {
            return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
        }

        // Clear OTP
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        return NextResponse.json({
            message: 'OTP verified successfully',
            verified: true,
            email: user.email
        }, { status: 200 });

    } catch (error) {

        return NextResponse.json({ message: 'OTP verification failed' }, { status: 500 });
    }
}