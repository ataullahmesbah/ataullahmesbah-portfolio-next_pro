import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/dbMongoose';
import RequestLog from '@/models/RequestLog';
import BlockedIP from '@/models/BlockedIP';


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
    const blockedIPs = await BlockedIP.find().select('ip');

    const ipCounts = await RequestLog.aggregate([
      { $group: { _id: '$ip', count: { $sum: 1 }, lastAccess: { $max: '$timestamp' } } },
      { $sort: { count: -1 } },
      { $limit: 100 },
    ]);

    return NextResponse.json({ logs, blockedIPs, ipCounts });
  } catch (error) {
    console.error(`Error fetching IP logs: ${error.message}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { ip, reason } = await req.json();
    await dbConnect();
    const blockedIP = new BlockedIP({ ip, reason, blockedBy: token.id });
    await blockedIP.save();

    // Log the block action
    await RequestLog.create({
      ip: token.ip || 'admin',
      endpoint: '/api/admin/ip-logs/block',
      method: 'POST',
      userId: token.id,
    });

    return NextResponse.json({ message: 'IP blocked successfully' }, { status: 201 });
  } catch (error) {
    console.error(`Error blocking IP: ${error.message}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}