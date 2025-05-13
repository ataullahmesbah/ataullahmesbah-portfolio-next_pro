import { NextResponse } from 'next/server';
import UsedCoupon from '@/models/UsedCoupon';
import dbConnect from '@/lib/dbMongoose';

export async function POST(request) {
    try {
        await dbConnect();
        const { userId, couponCode } = await request.json();

        if (!userId || !couponCode) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await UsedCoupon.create({ userId, couponCode });
        return NextResponse.json({ message: 'Coupon usage recorded' }, { status: 200 });
    } catch (error) {
        console.error('Error recording coupon usage:', error);
        return NextResponse.json({ error: 'Failed to record coupon usage: ' + error.message }, { status: 500 });
    }
}