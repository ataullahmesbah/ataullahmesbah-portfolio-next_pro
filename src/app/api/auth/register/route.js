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
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists with this email' }, { status: 400 });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json({ message: 'Username already taken' }, { status: 400 });
    }

    // Generate OTP and set expiry
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      otp,
      otpExpiresAt,
      status: 'inactive', // User is inactive until OTP is verified
      role: 'user', // Default role
    });

    await newUser.save();

    // Send OTP to the user's email
    await sendOTP(email, otp);

    return NextResponse.json({
      message: 'OTP sent successfully',
      email: email
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Registration failed. Please try again.' }, { status: 500 });
  }
}