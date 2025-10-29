// app/api/products/nav-ads/route.js


import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import NavAd from '@/models/NavAd';

export async function GET() {
    await dbConnect();

    try {
        const now = new Date();

        // Get all active ads within date range
        const activeAds = await NavAd.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        }).sort({
            createdAt: -1 // Show newest first
        });

        return NextResponse.json({
            success: true,
            data: activeAds
        });
    } catch (error) {
        console.error('Error fetching nav ads:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch nav ads'
        }, { status: 500 });
    }
}

export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();

        const navAd = new NavAd(body);
        await navAd.save();

        return NextResponse.json({
            success: true,
            message: 'Nav ad created successfully',
            data: navAd
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating nav ad:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                { success: false, error: errors.join(', ') },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}