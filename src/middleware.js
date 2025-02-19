// src/middleware.js

import { NextResponse } from "next/server";
import { verifyToken } from "./utils/jwt";


export function middleware(req) {
    const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const user = verifyToken(token);
    if (!user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    req.user = user;
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
