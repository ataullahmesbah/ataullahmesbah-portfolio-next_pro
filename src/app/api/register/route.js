import { NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectDB } from '@/lib/dbMongoose';

connectDB();

export async function POST(req) {
  const { username, email, password } = await req.json();

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 });
  }
}