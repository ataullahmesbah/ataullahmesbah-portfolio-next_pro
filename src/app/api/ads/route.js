// api/ads/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ad from '@/models/Ad';

export async function GET(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    let currentPage = searchParams.get('page') || '/';
    currentPage = currentPage.trim().replace(/\/$/, '');

    try {
        const now = new Date();

        // Direct database query with all filters
        const ads = await Ad.find({
            isActive: true,
            $or: [
                { pages: '*' },
                { pages: currentPage },
                { pages: { $in: [currentPage] } }
            ],
            $and: [
                {
                    $or: [
                        { startDate: { $lte: now } },
                        { startDate: null }
                    ]
                },
                {
                    $or: [
                        { endDate: { $gte: now } },
                        { endDate: null }
                    ]
                }
            ]
        }).sort({
            priority: -1, // Higher priority first
            createdAt: -1 // Then newest first
        });

 

        return NextResponse.json({
            success: true,
            data: ads
        });
    } catch (error) {
     
        return NextResponse.json({
            error: 'Failed to fetch ads'
        }, { status: 500 });
    }
}

export async function POST(req) {
    await dbConnect();
    try {
        const { adId, type } = await req.json();

        const update = type === 'impression'
            ? { $inc: { impressions: 1 } }
            : { $inc: { clicks: 1 } };

        await Ad.findByIdAndUpdate(adId, update);

        return NextResponse.json({
            success: true,
            message: `${type} tracked successfully`
        });
    } catch (error) {
        
        return NextResponse.json({
            error: 'Failed to track'
        }, { status: 500 });
    }
}