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
        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            existingCoupon.productId = productId;
            existingCoupon.discountPercentage = discountPercentage;
            existingCoupon.updatedAt = Date.now();
            await existingCoupon.save();
        } else {
            await Coupon.create({ code, productId, discountPercentage });
        }
        return NextResponse.json({ message: 'Coupon updated' }, { status: 200 });
    } catch (error) {
        console.error('Error updating coupon:', error);
        return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const { code } = await request.json();
        await Coupon.deleteOne({ code });
        return NextResponse.json({ message: 'Coupon deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}