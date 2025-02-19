// src/app/api/login/route.js


import bcrypt from "bcryptjs";
import { generateToken } from "@/utils/jwt";
import { connectDB } from "@/lib/dbMongoose";
import User from "@/models/User";

export async function POST(req) {
    try {
        await connectDB();

        const { email, password } = await req.json();
        if (!email || !password) {
            return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        const token = generateToken(user);

        return new Response(JSON.stringify({ message: "Login successful", token }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
    }
}
