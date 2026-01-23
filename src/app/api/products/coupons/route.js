import { NextResponse } from 'next/server';
import Coupon from '@/models/Coupon';
import dbConnect from '@/lib/dbMongoose';


export async function GET() {
    try {
        await dbConnect();
        const coupons = await Coupon.find({ isActive: true }).populate('productId', 'title');
        return NextResponse.json(coupons, { status: 200 });
    } catch (error) {
     
        return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const { code, productId, discountPercentage, useType, expiresAt } = await request.json();

        if (!code || !productId || discountPercentage == null || !useType || !expiresAt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        if (discountPercentage < 0 || discountPercentage > 100) {
            return NextResponse.json({ error: 'Discount percentage must be between 0 and 100' }, { status: 400 });
        }
        if (!['one-time', 'multiple'].includes(useType)) {
            return NextResponse.json({ error: 'Invalid use type' }, { status: 400 });
        }
        const expiresAtDate = new Date(expiresAt);
        if (isNaN(expiresAtDate.getTime())) {
            return NextResponse.json({ error: 'Invalid expiry date' }, { status: 400 });
        }
        if (expiresAtDate < new Date()) {
            return NextResponse.json({ error: 'Expiry date must be in the future' }, { status: 400 });
        }

        const existingCoupon = await Coupon.findOne({ code });
        if (existingCoupon) {
            existingCoupon.productId = productId;
            existingCoupon.discountPercentage = discountPercentage;
            existingCoupon.useType = useType;
            existingCoupon.expiresAt = expiresAtDate;
            existingCoupon.updatedAt = Date.now();
            await existingCoupon.save();
        } else {
            await Coupon.create({ code, productId, discountPercentage, useType, expiresAt: expiresAtDate });
        }
        return NextResponse.json({ message: 'Coupon updated' }, { status: 200 });
    } catch (error) {
        
        return NextResponse.json({ error: 'Failed to update coupon: ' + error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();
        const { code } = await request.json();
        if (!code) {
            return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
        }
        await Coupon.deleteOne({ code });
        return NextResponse.json({ message: 'Coupon deleted' }, { status: 200 });
    } catch (error) {
      
        return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
    }
}