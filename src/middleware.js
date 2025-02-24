import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = req.nextUrl;

    // Redirect unauthenticated users to login
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Redirect based on role
    if (pathname.startsWith('/dashboard/admin') && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
    }
    if (pathname.startsWith('/dashboard/moderator') && !['moderator', 'admin'].includes(token.role)) {
        return NextResponse.redirect(new URL('/', req.url));
    }
    if (pathname.startsWith('/dashboard/user') && !['user', 'moderator', 'admin'].includes(token.role)) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};