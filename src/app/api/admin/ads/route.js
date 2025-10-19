// app/api/admin/ads/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ads from '@/models/Ads';

export async function GET() {
    try {
        await dbConnect();
        const ads = await Ads.find().sort({ priority: -1, createdAt: -1 });
        return NextResponse.json(ads);
    } catch (error) {
        console.error('Get ads error:', error);
        return NextResponse.json({ message: 'Failed to fetch ads' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const data = await req.json();

        const newAd = new Ads(data);
        await newAd.save();

        return NextResponse.json({ message: 'Ad created successfully', ad: newAd });
    } catch (error) {
        console.error('Create ad error:', error);
        return NextResponse.json({ message: 'Failed to create ad' }, { status: 500 });
    }
}