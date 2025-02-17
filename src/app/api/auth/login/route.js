// src/app/api/auth/login/route.js


import { getToken } from '@/lib/jwt';
import { comparePassword } from '@/lib/auth';

import User from '@/models/User';
import { connectDB } from '@/lib/dbMongoose';



export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    console.log("Login request received for email:", email); // Log the email

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email); // Log if user not found
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for email:", email); // Log if password is invalid
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate token
    const token = getToken({ userId: user._id, role: user.role });

    console.log("Login successful for email:", email); // Log successful login

    return new Response(JSON.stringify({ token, user: { email: user.email, role: user.role } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Login error:", error); // Log the error
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}