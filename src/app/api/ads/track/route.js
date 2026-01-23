// app/api/ads/track/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ads from '@/models/Ad';



export async function POST(request) {
    await dbConnect();

    try {
        const { adId, type } = await request.json();
 

        if (type === 'impression') {
            await Ads.findByIdAndUpdate(adId, {
                $inc: { impressions: 1 } // ফিল্ড ঠিক করা
            });
        } else if (type === 'click') {
            await Ads.findByIdAndUpdate(adId, {
                $inc: { clicks: 1 }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
     
        return NextResponse.json(
            { success: false, error: 'Failed to track' },
            { status: 500 }
        );
    }
}