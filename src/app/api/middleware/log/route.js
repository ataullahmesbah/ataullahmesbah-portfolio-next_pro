// app/api/middleware/log/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import RequestLog from '@/models/RequestLog';
import BlockedIP from '@/models/BlockedIP';

export async function POST(request) {
    try {
        const { ip, endpoint, method, userId } = await request.json();

        await dbConnect();

        // Log request
        await RequestLog.create({ ip, endpoint, method, userId });

        // Check blocked IP
        const blocked = await BlockedIP.findOne({ ip });
        if (blocked) {
            return NextResponse.json({ blocked: true }, { status: 403 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Log error:', error);
        return NextResponse.json({ error: 'Log failed' }, { status: 500 });
    }
}