// app/api/test/check-ads/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ads from '@/models/Ads';

export async function GET() {
    await dbConnect();

    try {
        const ads = await Ads.find({ isActive: true });

        return NextResponse.json({
            success: true,
            activeAds: ads.length,
            ads: ads.map(ad => ({
                id: ad._id,
                title: ad.title,
                isActive: ad.isActive,
                startDate: ad.startDate,
                endDate: ad.endDate,
                targetPages: ad.targetPages
            }))
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}