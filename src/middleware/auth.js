// middleware/auth.js

import User from "@/models/User";
import jwt from "jsonwebtoken";


export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        req.user = user; // Attach user to the request object
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

export const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied. You do not have permission." });
    }
    next();
};