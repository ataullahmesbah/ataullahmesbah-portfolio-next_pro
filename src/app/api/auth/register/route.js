// src/app/api/auth/register/route.js


import { hashPassword } from '@/lib/auth';
import { connectDB } from '@/lib/dbMongoose';
import User from '@/models/User';

export async function POST(req) {
    try {
        await connectDB();

        const { firstName, lastName, email, password, confirmPassword } = await req.json();

        // Check if passwords match
        if (password !== confirmPassword) {
            return new Response(JSON.stringify({ error: "Passwords do not match" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "User already exists" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save();

        return new Response(JSON.stringify({ message: "User registered successfully" }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Registration error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}