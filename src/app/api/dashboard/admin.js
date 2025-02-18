// src/app/api/dashboard/admin.js

import { checkRole, verifyToken } from "@/middleware/auth";



export default async function handler(req, res) {
    try {
        await verifyToken(req, res);
        checkRole(["admin"])(req, res, () => {
            res.status(200).json({ message: "Welcome to the Admin Dashboard." });
        });
    } catch (error) {
        res.status(500).json({ message: "Error accessing admin dashboard.", error: error.message });
    }
}