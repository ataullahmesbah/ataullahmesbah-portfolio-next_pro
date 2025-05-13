// api/products/config/route.js

import { NextResponse } from 'next/server';
import Config from '@/models/Config';
import dbConnect from '@/lib/dbMongoose';


export async function GET() {
    try {
        await dbConnect();
        const config = await Config.findOne({ key: 'globalCoupon' });
        return NextResponse.json(config?.value || {}, { status: 200 });
    } catch (error) {
        console.error('Error fetching config:', error);
        return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const { code, discountPercentage, minCartTotal, expiresAt } = await request.json();

        if (!code || discountPercentage == null || minCartTotal == null || !expiresAt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        if (!Number.isFinite(Number(discountPercentage)) || discountPercentage < 0 || discountPercentage > 100) {
            return NextResponse.json({ error: 'Discount percentage must be between 0 and 100' }, { status: 400 });
        }
        if (!Number.isFinite(Number(minCartTotal)) || minCartTotal < 0) {
            return NextResponse.json({ error: 'Minimum cart total cannot be negative' }, { status: 400 });
        }
        const expiresAtDate = new Date(expiresAt);
        if (isNaN(expiresAtDate.getTime())) {
            return NextResponse.json({ error: 'Invalid expiry date' }, { status: 400 });
        }
        if (expiresAtDate < new Date()) {
            return NextResponse.json({ error: 'Expiry date must be in the future' }, { status: 400 });
        }

        await Config.updateOne(
            { key: 'globalCoupon' },
            {
                value: {
                    code,
                    discountPercentage: Number(discountPercentage),
                    minCartTotal: Number(minCartTotal),
                    expiresAt: expiresAtDate,
                },
                updatedAt: Date.now(),
            },
            { upsert: true }
        );
        return NextResponse.json({ message: 'Global coupon updated' }, { status: 200 });
    } catch (error) {
        console.error('Error updating config:', error);
        return NextResponse.json({ error: 'Failed to update config: ' + error.message }, { status: 500 });
    }
}