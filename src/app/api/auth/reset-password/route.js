// app/api/auth/reset-password/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbMongoose';
import User from '@/models/User';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, otp, newPassword } = await req.json();

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

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // ✅ FIX: Update password and clear OTP, but DON'T set forceLogout
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiresAt = null;
        // ❌ REMOVE: user.forceLogout = true; 
        await user.save();

        return NextResponse.json({
            message: 'Password reset successfully'
        });
    } catch (error) {
      
        return NextResponse.json({ message: 'Failed to reset password' }, { status: 500 });
    }
}