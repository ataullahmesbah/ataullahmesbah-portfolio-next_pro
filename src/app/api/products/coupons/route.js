import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Coupon from '@/models/Coupon';


export async function GET() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const coupons = await Coupon.find({ isActive: true }).populate('productId', 'title');
        return NextResponse.json(coupons, { status: 200 });
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const { code, productId, discountPercentage } = await request.json();
        await Coupon.create({ code, productId, discountPercentage });
        return NextResponse.json({ message: 'Coupon created' }, { status: 200 });
    } catch (error) {
        console.error('Error creating coupon:', error);
        return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
    }
}