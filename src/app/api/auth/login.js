// src/app/api/auth/login.js

import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed." });
    }

    const { email, password } = req.body;

    // Validate user credentials (e.g., check database)
    const user = { id: "12345", email: "user@example.com", role: "user" }; // Example user

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    // Set cookies
    const tokenCookie = serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600, // 1 hour
        path: "/",
    });

    const userCookie = serialize("user", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600, // 1 hour
        path: "/",
    });

    res.setHeader("Set-Cookie", [tokenCookie, userCookie]);
    res.status(200).json({ message: "Login successful." });
}