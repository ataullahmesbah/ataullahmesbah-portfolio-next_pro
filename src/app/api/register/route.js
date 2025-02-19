// src/app/api/register/route.js



import { connectDB } from "@/lib/dbMongoose";
import User from "@/models/User";
import { generateToken } from "@/utils/jwt";
import bcrypt from "bcryptjs";


export async function POST(req) {
    try {
        await connectDB();
        const { name, email, password, role } = await req.json();

        if (!name || !email || !password) {
            return new Response(JSON.stringify({ error: "All fields required" }), { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        const token = generateToken(newUser._id);

        return new Response(JSON.stringify({ message: "User registered successfully", token }), { status: 201 });
    } catch (error) {
        console.error("Register API Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
