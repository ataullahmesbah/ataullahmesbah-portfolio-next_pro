import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Coupon from '@/models/Coupon';
import UsedCoupon from '@/models/UsedCoupon';


export async function POST(request) {
    try {
        await dbConnect();
        const { userId, couponCode, email, phone } = await request.json();

        if (!couponCode || !email || !phone) {
            return NextResponse.json({ error: 'Coupon code, email, and phone are required' }, { status: 400 });
        }

        const coupon = await Coupon.findOne({ code: couponCode });
        if (!coupon) {
            return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
        }

        if (coupon.useType === 'one-time') {
            const existingUsage = await UsedCoupon.findOne({ couponCode, email, phone });
            if (existingUsage) {
                return NextResponse.json({ error: 'Coupon already used by this customer' }, { status: 400 });
            }

            await UsedCoupon.create({
                userId: userId || null,
                couponCode,
                email,
                phone,
            });
        }

        return NextResponse.json({ message: 'Coupon usage recorded' }, { status: 200 });
    } catch (error) {
        console.error('Error recording coupon usage:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}