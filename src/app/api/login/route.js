
import { NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '@/models/User';
import { connectDB } from '@/lib/dbMongoose';



connectDB();

export async function POST(req) {
    const { email, password } = await req.json();

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        // Redirect based on role
        let redirectUrl = '/';
        if (user.role === 'admin') {
            redirectUrl = '/dashboard/admin-dashboard';
        } else if (user.role === 'moderator') {
            redirectUrl = '/dashboard/moderator-dashboard';
        } else if (user.role === 'user') {
            redirectUrl = '/dashboard/user-dashboard';
        }

        return NextResponse.json({ token, redirectUrl });
    } catch (error) {
        return NextResponse.json({ message: 'Error logging in' }, { status: 500 });
    }
}