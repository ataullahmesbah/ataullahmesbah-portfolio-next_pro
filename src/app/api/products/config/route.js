// api/products/config/route.js

import { NextResponse } from 'next/server';
import Config from '@/models/Config';
import dbConnect from '@/lib/dbMongoose';

export async function GET() {
    try {

        await dbConnect();

        const config = await Config.findOne({ key: 'globalCoupon' });

        if (!config) {

            return NextResponse.json({}, { status: 200 });
        }
        if (!config.value.discountAmount) {

        }
        return NextResponse.json(config.value, { status: 200 });
    } catch (error) {

        return NextResponse.json({ error: `Failed to fetch global coupon: ${error.message}` }, { status: 500 });
    }
}

export async function POST(request) {
    try {

        await dbConnect();

        const { code, discountAmount, minCartTotal, expiresAt } = await request.json();


        if (!code || discountAmount == null || minCartTotal == null || !expiresAt) {

            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }
        if (discountAmount < 0) {

            return NextResponse.json({ error: 'Discount amount cannot be negative' }, { status: 400 });
        }
        if (minCartTotal < 0) {

            return NextResponse.json({ error: 'Minimum cart total cannot be negative' }, { status: 400 });
        }
        const expiresAtDate = new Date(expiresAt);
        if (isNaN(expiresAtDate.getTime()) || expiresAtDate < new Date()) {

            return NextResponse.json({ error: 'Invalid or past expiry date' }, { status: 400 });
        }

        const updateResult = await Config.updateOne(
            { key: 'globalCoupon' },
            {
                $set: {
                    value: {
                        code,
                        discountAmount: Number(discountAmount),
                        minCartTotal: Number(minCartTotal),
                        expiresAt: expiresAtDate
                    }
                }
            },
            { upsert: true }
        );


        return NextResponse.json({ message: 'Global coupon updated' }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ error: `Failed to update global coupon: ${error.message}` }, { status: 500 });
    }
}