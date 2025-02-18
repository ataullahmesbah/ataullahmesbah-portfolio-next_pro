// src/app/api/auth/register.js

import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/dbMongoose";
import User from "@/models/User";


export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed." });
    }

    await connectDB();

    const { firstName, lastName, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error registering user.", error: error.message });
    }
}