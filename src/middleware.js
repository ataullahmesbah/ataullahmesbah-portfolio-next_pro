import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose'; // Direct import for connection
import BlockedIP from './models/BlockedIP';
import RequestLog from './models/RequestLog';

// In-memory storage for rate limiting
export const ipStats = new Map();

const WINDOW_MS = 60 * 1000;
const SOFT_LIMIT = 30;
const TEMP_LIMIT = 100;
const TEMP_BLOCK_DURATION = 30 * 60 * 1000;
const MAX_WARNINGS = 3;

// List of all public route patterns
const PUBLIC_ROUTES = [
  /^\/$/,
  /^\/about$/,
  /^\/contact$/,
  /^\/blog(\/.*)?$/,
  /^\/post(\/.*)?$/,
  /^\/product(\/.*)?$/,
  /^\/category(\/.*)?$/,
  /^\/u\/[^\/]+$/,
  /^\/api\/blog\/[^\/]+$/,
  /^\/api\/post\/[^\/]+$/,
  /^\/api\/product\/[^\/]+$/,
  /^\/api\/category\/[^\/]+$/,
  /^\/api\/auth\/.*$/,
];

// MongoDB connection (singleton pattern)
let cachedDb = null;
async function dbConnect() {
  if (cachedDb) return cachedDb;
  try {
    cachedDb = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

export async function middleware(req) {
  const token = await getToken({ req: { headers: req.headers }, secret: process.env.NEXTAUTH_SECRET });
  const { pathname, searchParams } = req.nextUrl;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || 'unknown';

  // Initialize IP stats if not present
  if (!ipStats.has(ip)) {
    ipStats.set(ip, {
      routeCounts: new Map(),
      warnings: 0,
      blockUntil: 0,
      permanent: false,
    });
  }
  const ipData = ipStats.get(ip);

  // Check IP blocking status
  if (ipData.permanent || ipData.blockUntil > Date.now()) {
    return blockResponse(ipData.permanent);
  }

  // Skip rate limiting for public routes
  const isPublicRoute = PUBLIC_ROUTES.some(pattern => pattern.test(pathname));
  const isAdminApi = pathname.startsWith('/api/admin/') || pathname.startsWith('/src/api/admin/');

  if (!isPublicRoute && !isAdminApi) {
    const routeCount = (ipData.routeCounts.get(pathname) || 0) + 1;
    ipData.routeCounts.set(pathname, routeCount);

    const now = Date.now();
    ipData.routeCounts.forEach((count, route) => {
      if (now - WINDOW_MS > (ipData.routeCounts.get(route)?.timestamp || 0)) {
        ipData.routeCounts.set(route, { count: 0, timestamp: now });
      }
    });
    const totalHits = Array.from(ipData.routeCounts.values()).reduce((sum, count) => sum + count, 0);

    if (routeCount >= SOFT_LIMIT || totalHits >= TEMP_LIMIT) {
      return handleRateLimit(ipData, routeCount);
    }
  }

  // Async logging (non-blocking)
  logRequest(ip, pathname, req.method, token?.id);

  // Handle affiliate tracking
  if (searchParams.get('aff') && pathname !== '/api/affiliate/track') {
    return NextResponse.redirect(new URL(`/api/affiliate/track?aff=${searchParams.get('aff')}`, req.url));
  }

  // Redirect logged-in users from auth pages
  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Allow all public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Admin-only API routes
  if (isAdminApi) {
    if (!token || !token.role || token.role !== 'admin') {
      console.error(`Access denied to ${pathname} from IP ${ip}. Token: ${JSON.stringify(token)}`);
      return new NextResponse(
        JSON.stringify({ error: 'Access denied: Admin privileges required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return NextResponse.next();
}

// Helper functions
function blockResponse(isPermanent) {
  return new NextResponse(
    JSON.stringify({
      error: isPermanent
        ? 'IP permanently blocked due to repeated violations.'
        : 'IP temporarily blocked for 30 minutes due to excessive requests.',
    }),
    { status: 403, headers: { 'Content-Type': 'application/json' } }
  );
}

function handleRateLimit(ipData, routeCount) {
  ipData.warnings += 1;
  ipData.blockUntil = Date.now() + (routeCount >= SOFT_LIMIT ? 60 * 1000 : TEMP_BLOCK_DURATION);

  if (ipData.warnings >= MAX_WARNINGS) {
    ipData.permanent = true;
  }

  return new NextResponse(
    JSON.stringify({
      error: routeCount >= SOFT_LIMIT
        ? 'Too many requests. Access delayed for 1 minute.'
        : 'IP temporarily blocked for 30 minutes due to excessive requests.',
    }),
    { status: routeCount >= SOFT_LIMIT ? 429 : 403, headers: { 'Content-Type': 'application/json' } }
  );
}

async function logRequest(ip, endpoint, method, userId) {
  try {
    await dbConnect();
    await RequestLog.create({ ip, endpoint, method, userId });

    const blockedIP = await BlockedIP.findOne({ ip });
    if (blockedIP) {
      const ipData = ipStats.get(ip) || {};
      ipData.permanent = true;
      ipStats.set(ip, ipData);
    }
  } catch (error) {
    console.error('Middleware logging error:', error.message);
  }
}

export const config = {
  matcher: [
    '/',
    '/about',
    '/contact',
    '/login',
    '/register',
    '/u/:username*',
    '/blog/:path*',
    '/post/:path*',
    '/product/:path*',
    '/category/:path*',
    '/api/:path*',
    '/src/api/:path*',
  ],
};