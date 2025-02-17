// src/app/api/auth/login/route.js

import { connectDB } from "@/lib/dbMongoose";
import User from "@/models/User";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return new Response(JSON.stringify({ message: "Login successful", token }), { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(JSON.stringify({ error: "Login failed" }), { status: 500 });
  }
}
