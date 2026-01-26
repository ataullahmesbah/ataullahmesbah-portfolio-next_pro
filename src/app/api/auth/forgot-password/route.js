// app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
import { generateOTP, sendOTP } from '@/lib/otpUtils';
import dbConnect from '@/lib/dbMongoose';
import User from '@/models/User';


export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if email exists or not for security
            return NextResponse.json({ message: 'If the email exists, a verification code has been sent.' });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return NextResponse.json({ message: 'Your account is inactive. Please contact the admin.' }, { status: 400 });
        }

        // Generate OTP and set expiry
        const otp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to the user
        user.otp = otp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        // Send OTP to the user's email and get OTP
        await sendOTP(email, otp);

        return NextResponse.json({ message: 'Verification code sent successfully' });
    } catch (error) {
      
        return NextResponse.json({ message: 'Failed to process request' }, { status: 500 });
    }
}