import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import RequestLog from '@/models/RequestLog';
import BlockedIP from '@/models/BlockedIP';

// Rate limiting setup
const requestCounts = new Map();
const RATE_LIMIT = 100;
const WINDOW_MS = 15 * 60 * 1000;

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname, searchParams } = req.nextUrl;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || 'unknown';

  // Rate limiting
  const count = requestCounts.get(ip) || 0;
  if (count >= RATE_LIMIT) {
    console.error(`Rate limit exceeded for IP ${ip}`);
    return new NextResponse(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }
  requestCounts.set(ip, count + 1);
  setTimeout(() => requestCounts.delete(ip), WINDOW_MS);

  try {
    // Connect to MongoDB
    await dbConnect();

    // Check if IP is blocked
    const blockedIP = await BlockedIP.findOne({ ip });
    if (blockedIP) {
      console.error(`Blocked IP ${ip} attempted to access ${pathname}`);
      return new NextResponse(
        JSON.stringify({ error: 'Access Denied: Your IP is blocked' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Log request
    await RequestLog.create({
      ip,
      endpoint: pathname,
      method: req.method,
      userId: token?.id || null,
    });
  } catch (error) {
    console.error(`Middleware error for IP ${ip}: ${error.message}`);
    // Proceed without logging to avoid blocking legitimate requests
  }

  // Affiliate tracking
  const affCode = searchParams.get('aff');
  if (affCode && pathname !== '/api/affiliate/track') {
    const trackUrl = new URL('/api/affiliate/track', req.url);
    trackUrl.searchParams.set('aff', affCode);
    return NextResponse.redirect(trackUrl);
  }

  // Redirect logged-in users from login/register
  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }



  // Public profile routes
  if (pathname.startsWith('/u/')) {
    return NextResponse.next();
  }

  // Protect API routes
  if (pathname.startsWith('/api/')) {
    if (pathname.startsWith('/api/auth/')) {
      return NextResponse.next();
    }
    if (!token) {
      console.error(`Unauthorized access attempt to ${pathname} from IP ${ip}`);
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: Please log in' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (token.role !== 'admin') {
      console.error(`Non-admin access attempt to ${pathname} from IP ${ip}`);
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/u/:username*', '/api/:path*'],
};