// app/api/ads/route.js - COMPLETE FIXED VERSION
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ads from '@/models/Ads';

export async function GET(req) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const currentPage = searchParams.get('page') || '/';
        const currentDate = new Date();

        console.log('🔍 Fetching ads for page:', currentPage);

        const ads = await Ads.find({
            isActive: true,
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate },
            $or: [
                { targetPages: '*' },
                { targetPages: currentPage },
                { targetPages: { $in: [currentPage] } }
            ]
        }).sort({ createdAt: -1 });

        console.log('✅ Found ads:', ads.length);

        return NextResponse.json({
            success: true,
            data: ads
        });
    } catch (error) {
        console.error('❌ API Error:', error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}

// FIXED POST METHOD - Track impressions
export async function POST(req) {
    await dbConnect();

    try {
        const { adId } = await req.json();

        console.log('📈 Tracking impression for ad:', adId);

        // Update impressions count
        await Ads.findByIdAndUpdate(adId, {
            $inc: { impressions: 1 }
        });

        return NextResponse.json({
            success: true,
            message: 'Impression tracked successfully'
        });
    } catch (error) {
        console.error('❌ POST Error:', error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}