import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Coupon from '@/models/Coupon';


export async function POST(request) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const { code, productIds } = await request.json();
        const coupon = await Coupon.findOne({ code, isActive: true });
        if (!coupon) {
            return NextResponse.json({ valid: false, message: 'Invalid or inactive coupon' }, { status: 400 });
        }
        if (!productIds.includes(coupon.productId.toString())) {
            return NextResponse.json({ valid: false, message: 'Coupon not applicable to cart items' }, { status: 400 });
        }
        return NextResponse.json({
            valid: true,
            discountPercentage: coupon.discountPercentage,
            productId: coupon.productId,
        }, { status: 200 });
    } catch (error) {
        console.error('Error validating coupon:', error);
        return NextResponse.json({ valid: false, message: 'Failed to validate coupon' }, { status: 500 });
    }
}