import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Redirect authenticated users away from login and register pages
    if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Protect API routes
    // if (pathname.startsWith('/api') && !token) {
    //     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    // '/api/:path*'

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/register'],
};