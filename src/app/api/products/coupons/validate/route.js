// api/products/coupons/validate/route.js 
import { NextResponse } from 'next/server';
import UsedCoupon from '@/models/UsedCoupon';
import Coupon from '@/models/Coupon';
import dbConnect from '@/lib/dbMongoose';
import Config from '@/models/Config';




export async function POST(request) {
    try {
        await dbConnect();
        const { code, productIds, userId, cartTotal } = await request.json();

        if (!code || !productIds || !userId || cartTotal == null) {
            return NextResponse.json({ valid: false, message: 'Missing required fields' }, { status: 400 });
        }

        // Check for product-specific coupon
        const coupon = await Coupon.findOne({ code, isActive: true });
        if (coupon) {
            if (!productIds.includes(coupon.productId.toString())) {
                return NextResponse.json({ valid: false, message: 'Coupon not applicable to cart items' }, { status: 400 });
            }
            if (coupon.expiresAt && coupon.expiresAt < new Date()) {
                return NextResponse.json({ valid: false, message: 'Coupon has expired' }, { status: 400 });
            }
            if (coupon.useType === 'one-time') {
                const usedCoupon = await UsedCoupon.findOne({ userId, couponCode: code });
                if (usedCoupon) {
                    return NextResponse.json({ valid: false, message: 'This coupon has already been used' }, { status: 400 });
                }
            }
            return NextResponse.json({
                valid: true,
                type: 'product',
                discountPercentage: coupon.discountPercentage,
                productId: coupon.productId,
            }, { status: 200 });
        }

        // Check for global coupon
        const globalCoupon = await Config.findOne({ key: 'globalCoupon', 'value.code': code });
        if (globalCoupon) {
            const { discountPercentage, minCartTotal, expiresAt } = globalCoupon.value;
            if (cartTotal < minCartTotal) {
                return NextResponse.json({ valid: false, message: `Cart total must be at least ৳${minCartTotal}` }, { status: 400 });
            }
            if (expiresAt && new Date(expiresAt) < new Date()) {
                return NextResponse.json({ valid: false, message: 'Global coupon has expired' }, { status: 400 });
            }
            // Global coupons are always multiple-use for simplicity
            return NextResponse.json({
                valid: true,
                type: 'global',
                discountPercentage,
            }, { status: 200 });
        }

        return NextResponse.json({ valid: false, message: 'Invalid coupon code' }, { status: 400 });
    } catch (error) {
        console.error('Error validating coupon:', error);
        return NextResponse.json({ valid: false, message: 'Failed to validate coupon: ' + error.message }, { status: 500 });
    }
}