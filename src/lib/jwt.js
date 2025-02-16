// lib/jwt.js
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export const getToken = (payload) => {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
    return jwt.verify(token, SECRET);
};
