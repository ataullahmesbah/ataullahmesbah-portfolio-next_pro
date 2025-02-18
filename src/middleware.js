// src/middleware.js
// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/auth/login", "/auth/register"];

    // Allow access to public routes
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Get the token and user from cookies
    const token = request.cookies.get("token")?.value;
    const userCookie = request.cookies.get("user")?.value;

    // If no token, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Parse the user cookie (if it exists)
    let user = null;
    if (userCookie) {
        try {
            user = JSON.parse(userCookie);
        } catch (error) {
            console.error("Error parsing user cookie:", error);
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    // Role-based access control
    if (pathname.startsWith("/dashboard/admin") && user?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }

    if (pathname.startsWith("/dashboard/moderator") && user?.role !== "moderator") {
        return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }

    return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
    matcher: ["/dashboard/:path*"], // Only apply to dashboard routes
};