// api/admin/ads/track/route.js
import dbConnect from "@/lib/dbMongoose";
import Ad from "@/models/Ads";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();
    try {
        const { adId, type } = await req.json(); // type: 'view' or 'click'
        const update = type === 'view' ? { $inc: { views: 1 } } : { $inc: { clicks: 1 } };
        const ad = await Ad.findByIdAndUpdate(adId, update, { new: true });
        if (!ad) return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
        return NextResponse.json(ad);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
    }
}