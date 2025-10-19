// app/api/ads/[id]/track/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ads from '@/models/Ads';

export async function POST(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const { type } = await req.json();

        const updateField = type === 'click' ? { $inc: { clicks: 1 } } : { $inc: { impressions: 1 } };

        await Ads.findByIdAndUpdate(id, updateField);

        return NextResponse.json({ message: 'Tracking recorded' });
    } catch (error) {
        console.error('Tracking error:', error);
        return NextResponse.json({ message: 'Failed to record tracking' }, { status: 500 });
    }
}