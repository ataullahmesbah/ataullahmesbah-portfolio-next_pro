import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const token = await getToken({ req: { headers: req.headers }, secret: process.env.NEXTAUTH_SECRET });
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

    // ✅ 3. Public profile routes (/u/[username]) - No authentication required
    if (pathname.startsWith('/u/')) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/register', '/u/:username*'],
};
