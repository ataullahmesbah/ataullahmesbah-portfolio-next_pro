import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbMongoose';
import RequestLog from '@/models/RequestLog';
import BlockedIP from '@/models/BlockedIP';

// Access ipStats from global scope (shared with middleware)
const ipStats = globalThis.ipStats || new Map();

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();
    const logs = await RequestLog.find()
      .sort({ timestamp: -1 })
      .limit(1000)
      .populate('userId', 'username email');
    const blockedIPs = await BlockedIP.find().select('ip reason blockedAt blockedBy');

    const ipCounts = await RequestLog.aggregate([
      { $group: { _id: '$ip', count: { $sum: 1 }, lastAccess: { $max: '$timestamp' } } },
      { $sort: { count: -1 } },
      { $limit: 100 },
    ]);

    // Combine in-memory and DB block statuses
    const allBlockedIPs = blockedIPs.map(ip => ip.ip);
    if (ipStats) {
      ipStats.forEach((data, ip) => {
        if (data.permanent && !allBlockedIPs.includes(ip)) allBlockedIPs.push(ip);
      });
    }

    return NextResponse.json({ logs, blockedIPs, ipCounts, allBlockedIPs });
  } catch (error) {
   
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { ip, reason, action } = await req.json();
    await dbConnect();

    if (action === 'permanent') {
      const blockedIP = new BlockedIP({ ip, reason, blockedBy: token.id });
      await blockedIP.save();
      if (ipStats.get(ip)) ipStats.get(ip).permanent = true;
    } else if (action === 'temporary') {
      if (ipStats.get(ip)) ipStats.get(ip).blockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
    } else if (action === 'unblock') {
      await BlockedIP.deleteOne({ ip });
      const ipData = ipStats.get(ip);
      if (ipData) {
        ipData.permanent = false;
        ipData.blockUntil = 0;
        ipData.warnings = 0;
        ipData.routeCounts.clear();
      }
    }

    return NextResponse.json({ message: `${action} action performed on IP ${ip}` }, { status: 200 });
  } catch (error) {
 
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}