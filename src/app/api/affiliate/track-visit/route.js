// app/api/affiliate/track-visit/route.js
import { NextResponse } from 'next/server';
import Affiliate from '@/models/Affiliate';
import AffiliateVisit from '@/models/AffiliateVisit';
import dbConnect from '@/lib/dbMongoose';

export async function POST(request) {
    try {
        const { affiliateCode, visitedPage, visitorIp } = await request.json();
        if (!affiliateCode || !visitedPage) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();
        const affiliate = await Affiliate.findOne({ affiliateCode, status: 'approved' });
        if (!affiliate) {
            return NextResponse.json({ message: 'Invalid affiliate code' }, { status: 404 });
        }

        await AffiliateVisit.create({
            affiliateId: affiliate._id,
            affiliateCode,
            visitedPage,
            visitorIp: visitorIp ? visitorIp.replace(/\.\d+$/, '.xxx') : 'unknown',
        });

        return NextResponse.json({ message: 'Visit recorded' }, { status: 201 });
    } catch (error) {
        console.error('Track visit error:', error);
        return NextResponse.json({ message: 'Failed to record visit', error: error.message }, { status: 500 });
    }
}