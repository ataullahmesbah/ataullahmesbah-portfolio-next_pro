import { NextResponse } from 'next/server';

// Mock coupon data (replace with database in production)
const coupons = [
    { code: 'Team101', discount: 300 },
];

export async function POST(request) {
    try {
        const { code } = await request.json();
        const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());

        if (coupon) {
            return NextResponse.json({ valid: true, discount: coupon.discount }, { status: 200 });
        } else {
            return NextResponse.json({ valid: false, message: 'Invalid coupon' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error validating coupon:', error);
        return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
    }
}