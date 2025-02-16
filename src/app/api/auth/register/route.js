// src/app/api/auth/register/route.js


import { connectDB } from "@/lib/dbMongoose";
import User from "@/models/User";

import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        await connectDB();
        const { firstName, lastName, email, password } = await req.json();

        if (!firstName || !lastName || !email || !password) {
            return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "User already exists" }), { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
    } catch (error) {
        console.error("Registration Error:", error);
        return new Response(JSON.stringify({ error: "Registration failed" }), { status: 500 });
    }
}
