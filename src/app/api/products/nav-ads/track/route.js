// app/api/products/nav-ads/track/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import NavAd from '@/models/NavAd';

export async function POST(req) {
    await dbConnect();

    try {
        const { adId, type } = await req.json();

        const update = type === 'impression'
            ? { $inc: { impressions: 1 } }
            : { $inc: { clicks: 1 } };

        await NavAd.findByIdAndUpdate(adId, update);

        return NextResponse.json({
            success: true,
            message: `${type} tracked successfully`
        });
    } catch (error) {
    
        return NextResponse.json({
            success: false,
            error: 'Failed to track'
        }, { status: 500 });
    }
}
