"use server";


import { connectDB } from "@/lib/dbMongoose";
import user from "@/models/User";
import bcrypt from "bcryptjs";


export async function registerUser({ firstName, lastName, email, password }) {
  try {
    await connectDB();
    const existingUser = await user.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return { success: true, message: "User registered successfully", user: newUser };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
