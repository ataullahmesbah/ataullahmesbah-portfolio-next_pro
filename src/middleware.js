import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname, searchParams } = req.nextUrl;

    // ✅ Affiliate tracking: Redirect to /api/affiliate/track if ?aff= is present
    const affCode = searchParams.get('aff');
    if (affCode && pathname !== '/api/affiliate/track') {
        const trackUrl = new URL('/api/affiliate/track', req.url);
        trackUrl.searchParams.set('aff', affCode);
        return NextResponse.redirect(trackUrl);
    }

    // ✅ Redirect if user is logged in and tries to access login or register page
    if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // ✅ Public profile routes (/u/[username]) - No authentication required
    if (pathname.startsWith('/u/')) {
        return NextResponse.next();
    }

    // ✅ Protect API routes: Only allow access for authenticated admins
    if (pathname.startsWith('/api/')) {
        // Exclude NextAuth routes to prevent breaking authentication
        if (pathname.startsWith('/api/auth/')) {
            return NextResponse.next();
        }

        // Check if user is authenticated
        if (!token) {
            return new NextResponse(
                JSON.stringify({ error: 'Unauthorized: Please log in' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if user has admin role
        if (token.role !== 'admin') {
            return new NextResponse(
                JSON.stringify({ error: 'Forbidden: Admin access required' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Allow admins to proceed
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/register', '/u/:username*', '/api/:path*'],
};