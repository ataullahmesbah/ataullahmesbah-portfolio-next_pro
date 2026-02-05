// middleware.js

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

// import dbConnect from './lib/dbMongoose';
// import BlockedIP from './models/BlockedIP';
// import RequestLog from './models/RequestLog';

// In-memory storage for rate limiting and blocks
const ipStats = new Map();

const WINDOW_MS = 60 * 1000; // 1 minute
const SOFT_LIMIT = 300; // 30 hits per route in 1 minute
const TEMP_LIMIT = 1500; // 100 total hits in 1 minute
const TEMP_BLOCK_DURATION = 0 * 60 * 1000; // 30 minutes 30 * 60 * 1000;
const MAX_WARNINGS = 3; // 3 warnings or temp blocks lead to permanent block

// List of admin-only API routes
const ADMIN_ONLY_API_ROUTES = [
  '/api/admin/users',
  '/api/auth/user',
  '/api/users',
  '/api/products/orders',
  '/api/admin/verify',
  '/api/admin/ip-logs',
  // '/api/comments',
  '/api/comments/approved',
  '/api/comments/pending',
  '/api/products/config',
  '/api/products/coupons',
  // '/api/auth/register',
];


const PUBLIC_API_ROUTES = [
  '/api/products/orders', // POST method only
];




export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  const method = req.method;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || 'unknown';
  const now = Date.now();
  const host = req.headers.get('host') || '';




  // === STRICT SUBDOMAIN BLOCKING ===
  // Development environment e subdomain block
  if (process.env.NODE_ENV === 'development') {
    // All subdomain patterns block
    if (host.match(/^[a-zA-Z0-9-]+\.localhost(:[0-9]+)?$/)) {
      console.log(`🚫 Blocked subdomain: ${host}`);
      return new NextResponse(
        JSON.stringify({
          error: 'Subdomain access is disabled. Use http://localhost:3000'
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // 127.0.0.1 er subdomain block
    if (host.match(/^[a-zA-Z0-9-]+\.127\.0\.0\.1(:[0-9]+)?$/)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Subdomain access is disabled. Use http://127.0.0.1:3000'
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  // Initialize IP stats if not present

  if (!ipStats.has(ip)) {
    ipStats.set(ip, {
      routeCounts: new Map(),
      warnings: 0,
      blockUntil: 0,
      permanent: false,
      lastHit: {}
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
  const routeCount = (ipData.routeCounts.get(pathname) || 0) + 1;
  ipData.routeCounts.set(pathname, routeCount);
  ipData.lastHit[pathname] = now;

  // Clean old entries
  // Clean old entries (1 minute window)
  ipData.routeCounts.forEach((count, route) => {
    const lastHitTime = ipData.lastHit[route] || 0;
    if (now - lastHitTime > WINDOW_MS) {
      ipData.routeCounts.delete(route);
      delete ipData.lastHit[route];
    }
  });



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



  // Affiliate tracking, redirects, and API protection

  const searchParams = req.nextUrl.searchParams;
  const affCode = searchParams.get('aff');
  if (affCode && pathname !== '/api/affiliate/track') {
    const trackUrl = new URL('/api/affiliate/track', req.url);
    trackUrl.searchParams.set('aff', affCode);
    return NextResponse.redirect(trackUrl);
  }

  // === 3. Auth Redirects ===
  // if (token && (pathname === '/login' || pathname === '/register')) {
  //   return NextResponse.redirect(new URL('/', req.url));
  // }

  // if (pathname.startsWith('/u/')) {
  //   return NextResponse.next();
  // }

  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname.startsWith('/u/')) {
    return NextResponse.next();
  }

  // Admin-only API route protection
  // if (ADMIN_ONLY_API_ROUTES.includes(pathname)) {
  //   if (!token || !token.role || token.role !== 'admin') {
  //     return new NextResponse(
  //       JSON.stringify({ error: 'Access denied: Admin role required' }),
  //       { status: 403, headers: { 'Content-Type': 'application/json' } }
  //     );
  //   }
  // }


  // ✅ PUBLIC ACCESS: Order Creation (POST)
  if (pathname === '/api/products/orders' && method === 'POST') {
    // Allow order creation without authentication
    return NextResponse.next();
  }

  // ✅ PUBLIC ACCESS: Order Search by ID (GET with query params)
  if (pathname === '/api/products/orders' && method === 'GET') {
    const searchParams = req.nextUrl.searchParams;

    // যদি orderId বা email দিয়ে search করা হয় (public access allowed)
    if (searchParams.has('orderId') || searchParams.has('email') || searchParams.has('phone')) {
      return NextResponse.next();
    }

    // যদি সব order fetch করতে চায় (admin/moderator required)
    if (!searchParams.has('orderId') && !searchParams.has('email') && !searchParams.has('phone')) {
      if (!token || (token.role !== 'admin' && token.role !== 'moderator')) {
        return new NextResponse(
          JSON.stringify({ error: 'Admin/Moderator access required to view all orders' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    return NextResponse.next();
  }


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