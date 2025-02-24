import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import User from '@/models/User';
import dbConnect from '@/lib/dbMongoose';

export async function POST(req) {
  try {
    await dbConnect(); // Connect to MongoDB using Mongoose
    const { username, email, password } = await req.json();

    console.log('Registration data:', { username, email, password });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log('User saved to database:', newUser);

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}