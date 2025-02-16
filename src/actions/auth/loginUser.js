"use server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import user from "@/models/User";
import { connectDB } from "@/lib/dbMongoose";


export async function loginUser({ email, password }) {
  try {
    await connectDB();
    const user = await user.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { success: true, token, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
