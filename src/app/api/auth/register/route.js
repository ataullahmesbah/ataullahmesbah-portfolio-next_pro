// src/app/api/auth/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/dbMongoose";


export async function POST(req) {
    await connectDB();

    try {
        const { firstName, lastName, email, password } = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists." },
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword); // Debugging

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return NextResponse.json(
            { message: "User registered successfully." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}