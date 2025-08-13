//src/app/api/auth/register/route.js

import { NextResponse } from 'next/server';
import { generateOTP, sendOTP } from '@/lib/otpUtils';
import User from '@/models/User';

import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbMongoose';

export async function POST(req) {
  try {
    await dbConnect();
    const { username, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Generate OTP and set expiry
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save OTP and user data temporarily
    const tempUser = new User({
      username,
      email,
      password: hashedPassword, // Store the hashed password
      otp,
      otpExpiresAt,
      status: 'inactive', // User is inactive until OTP is verified
    });

    await tempUser.save();

    // Send OTP to the user's email (DO NOT send the password)
    await sendOTP(email, otp);

    return NextResponse.json({ message: 'OTP sent successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}