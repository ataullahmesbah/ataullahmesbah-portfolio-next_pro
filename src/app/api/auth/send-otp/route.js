// api/auth/send-otp/route.js

import { NextResponse } from 'next/server';
import { generateOTP, sendOTP } from '@/lib/otpUtils';
import User from '@/models/User';
import dbConnect from '@/lib/dbMongoose';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        // Check if user exists and password matches
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return NextResponse.json({ message: 'Your account is inactive. Please contact the admin.' }, { status: 400 });
        }

        // Generate OTP and set expiry
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to the user
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        // Send OTP to the user's email
        await sendOTP(email, otp);

        return NextResponse.json({ message: 'OTP sent successfully' });

    } catch (error) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 });
    }
}