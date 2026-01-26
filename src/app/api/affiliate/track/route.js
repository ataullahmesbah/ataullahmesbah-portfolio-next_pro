// app/api/affiliate/track/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Affiliate from '@/models/Affiliate';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const affCode = searchParams.get('aff');
        if (!affCode) {
            return NextResponse.redirect('https://ataullahmesbah.com');
        }

        await dbConnect();
        const affiliate = await Affiliate.findOne({ affiliateCode: affCode, status: 'approved' });
        if (!affiliate) {
            return NextResponse.redirect('https://ataullahmesbah.com');
        }

        // Set cookie to track affiliate for 30 days
        const response = NextResponse.redirect('https://ataullahmesbah.com');
        response.cookies.set('affiliate', affCode, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });
        return response;
    } catch (error) {

        return NextResponse.redirect('https://ataullahmesbah.com');
    }
}