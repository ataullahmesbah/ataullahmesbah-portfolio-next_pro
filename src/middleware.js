// middleware.js

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

// import dbConnect from './lib/dbMongoose';
// import BlockedIP from './models/BlockedIP';
// import RequestLog from './models/RequestLog';

// In-memory storage for rate limiting and blocks
const ipStats = new Map(); // { ip: { routeCounts: Map, warnings: number, blockUntil: number, permanent: boolean } }

const WINDOW_MS = 60 * 1000; // 1 minute
const SOFT_LIMIT = 30; // 30 hits per route in 1 minute
const TEMP_LIMIT = 100; // 100 total hits in 1 minute
const TEMP_BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_WARNINGS = 3; // 3 warnings or temp blocks lead to permanent block

// List of admin-only API routes
const ADMIN_ONLY_API_ROUTES = [
  '/api/admin/users',
  '/api/auth/user',
  '/api/users',
  '/api/products/orders',
  '/api/admin/verify',
  '/api/admin/ip-logs',
  '/api/comments/approved',
  '/api/comments/pending',
  '/api/products/config',
  '/api/products/coupons',
  // '/api/auth/register',
];

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || 'unknown';

  // Initialize IP stats if not present
  if (!ipStats.has(ip)) {
    ipStats.set(ip, {
      routeCounts: new Map(), // Track hits per route
      warnings: 0,
      blockUntil: 0,
      permanent: false,
    });
  }
  const ipData = ipStats.get(ip);

  // Check if IP is permanently blocked
  if (ipData.permanent) {
    return new NextResponse(
      JSON.stringify({ error: 'IP permanently blocked due to repeated violations.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Check if IP is temporarily blocked
  if (ipData.blockUntil > Date.now()) {
    return new NextResponse(
      JSON.stringify({ error: 'IP temporarily blocked for 30 minutes due to excessive requests.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Update route count
  const now = Date.now();
  const routeCount = (ipData.routeCounts.get(pathname) || 0) + 1;
  ipData.routeCounts.set(pathname, routeCount);

  // Clean old entries
  ipData.routeCounts.forEach((count, route) => {
    if (now - WINDOW_MS > (ipData.lastHit?.[route] || 0)) {
      ipData.routeCounts.delete(route);
    }
  });
  ipData.lastHit = ipData.lastHit || {};
  ipData.lastHit[pathname] = now;

  const totalHits = Array.from(ipData.routeCounts.values()).reduce((a, b) => a + b, 0);

  // Soft limit
  if (routeCount >= SOFT_LIMIT) {
    ipData.warnings += 1;
    ipData.blockUntil = now + 60 * 1000;
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Try again in 1 minute.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Hard limit
  if (totalHits >= TEMP_LIMIT) {
    ipData.warnings += 1;
    ipData.blockUntil = now + TEMP_BLOCK_DURATION;
    if (ipData.warnings >= MAX_WARNINGS) {
      ipData.permanent = true;
    }
    return new NextResponse(
      JSON.stringify({ error: 'IP blocked for 30 minutes.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Log request to MongoDB
  // try {
  //   await dbConnect();
  //   await RequestLog.create({
  //     ip,
  //     endpoint: pathname,
  //     method: req.method,
  //     userId: token?.id || null,
  //   });

  // Check if IP is blocked in DB (e.g., manually blocked by admin)
  //   const blockedIP = await BlockedIP.findOne({ ip });
  //   if (blockedIP) {
  //     ipData.permanent = true;
  //     return new NextResponse(
  //       JSON.stringify({ error: 'IP permanently blocked by admin.' }),
  //       { status: 403, headers: { 'Content-Type': 'application/json' } }
  //     );
  //   }
  // } catch (error) {
  //   console.error(`Middleware error for IP ${ip}: ${error.message}`);
  // }

  // Affiliate tracking, redirects, and API protection

  const searchParams = req.nextUrl.searchParams;
  const affCode = searchParams.get('aff');
  if (affCode && pathname !== '/api/affiliate/track') {
    const trackUrl = new URL('/api/affiliate/track', req.url);
    trackUrl.searchParams.set('aff', affCode);
    return NextResponse.redirect(trackUrl);
  }

  // === 3. Auth Redirects ===
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname.startsWith('/u/')) {
    return NextResponse.next();
  }

  // Admin-only API route protection
  // if (ADMIN_ONLY_API_ROUTES.includes(pathname)) {
  //   if (!token || !token.role || token.role !== 'admin') {
  //     console.error(`Access denied to ${pathname} from IP ${ip}. Token: ${JSON.stringify(token)}`);
  //     return new NextResponse(
  //       JSON.stringify({ error: 'Access denied: Admin role required' }),
  //       { status: 403, headers: { 'Content-Type': 'application/json' } }
  //     );
  //   }
  // }

  //  Admin API Protection 

  if (ADMIN_ONLY_API_ROUTES.includes(pathname)) {
    if (!token || token.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // All other /api/** routes are public
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/u/:username*', '/api/:path*'],
};