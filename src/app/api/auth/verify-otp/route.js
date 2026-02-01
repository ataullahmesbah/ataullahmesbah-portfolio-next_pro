// api/auth/verify-otp/route.js

import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbMongoose';


export async function POST(req) {
    try {
        await dbConnect();
        const { email, otp } = await req.json();

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || user.otp !== otp) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        // Check if OTP has expired
        if (new Date() > new Date(user.otpExpiresAt)) {
            return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
        }

        // ✅ IMPORTANT FIX: Clear forceLogout during OTP verification
        // This ensures user can login after role change
        if (user.forceLogout) {
            user.forceLogout = false;
        }

        // Clear OTP
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        return NextResponse.json({
            message: 'OTP verified successfully',
            verified: true,
            email: user.email,
            forceLogoutCleared: true
        }, { status: 200 });

    } catch (error) {
        console.error('OTP Verification Error:', error);
        return NextResponse.json({ message: 'OTP verification failed' }, { status: 500 });
    }
}