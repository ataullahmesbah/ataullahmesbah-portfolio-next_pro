// app/api/admin/users/reset-password/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/dbMongoose';

export async function POST(req) {
    try {
        await dbConnect();
        const { userId, newPassword } = await req.json();

        // Validate password
        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and set force logout
        user.password = hashedPassword;
        user.forceLogout = true; // Force user to logout
        await user.save();

        return NextResponse.json({ message: 'Password reset successfully. User will be logged out.' });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ message: 'Failed to reset password' }, { status: 500 });
    }
}