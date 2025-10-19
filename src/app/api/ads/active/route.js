// app/api/ads/active/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ads from '@/models/Ads';


export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        const activeAds = await Ads.find({
            isActive: true,
            startDate: { $lte: now },
            $or: [
                { endDate: { $exists: false } },
                { endDate: null },
                { endDate: { $gte: now } }
            ]
        }).sort({ priority: -1, createdAt: -1 });

        // Increment impressions
        await Promise.all(
            activeAds.map(ad =>
                Ads.findByIdAndUpdate(ad._id, { $inc: { impressions: 1 } })
            )
        );

        return NextResponse.json(activeAds);
    } catch (error) {
        console.error('Get active ads error:', error);
        return NextResponse.json({ message: 'Failed to fetch active ads' }, { status: 500 });
    }
}