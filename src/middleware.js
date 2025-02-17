import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';


export function middleware(req) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const decoded = verifyToken(token);

        if (req.nextUrl.pathname.startsWith('/admin') && decoded.role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        if (req.nextUrl.pathname.startsWith('/user') && decoded.role !== 'user') {
            return NextResponse.redirect(new URL('/unauthorized', req.url));
        }

        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/admin/:path*', '/user/:path*'],
};