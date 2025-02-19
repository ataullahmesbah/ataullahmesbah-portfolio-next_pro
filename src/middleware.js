import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Redirect based on role
        if (request.nextUrl.pathname.startsWith('/dashboard/admin-dashboard') && decoded.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
        if (request.nextUrl.pathname.startsWith('/dashboard/moderator-dashboard') && !['moderator', 'admin'].includes(decoded.role)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        if (request.nextUrl.pathname.startsWith('/dashboard/user-dashboard') && !['user', 'moderator', 'admin'].includes(decoded.role)) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*'],
};