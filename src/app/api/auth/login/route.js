// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/dbMongoose";


export async function POST(req) {
    await connectDB();

    try {
        const { email, password } = await req.json();
        console.log("Login request received:", { email, password }); // Debugging

        // Find the user by email
        const user = await User.findOne({ email });
        console.log("User found:", user); // Debugging

        if (!user) {
            console.log("User not found:", email); // Debugging
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 400 }
            );
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password valid:", isPasswordValid); // Debugging

        if (!isPasswordValid) {
            console.log("Invalid password for user:", email); // Debugging
            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 400 }
            );
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("Login successful for user:", email); // Debugging
        return NextResponse.json(
            { token, user: { id: user._id, email: user.email, role: user.role } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during login:", error); // Debugging
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}