// middleware/authMiddleware.js

import { verifyToken } from "@/lib/jwt";



export function authenticate(req) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return { error: "Unauthorized", status: 401 };
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token);
        return decoded;
    } catch (error) {
        return { error: "Invalid token", status: 403 };
    }
}
