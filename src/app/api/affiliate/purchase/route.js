// app/api/affiliate/purchase/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Affiliate from '@/models/Affiliate';
import AffiliateTransaction from '@/models/AffiliateTransaction';

export async function POST(request) {
    try {
        const { productId, amount } = await request.json();
        const affCode = request.cookies.get('affiliate')?.value;

        if (!productId || !amount) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();
        if (affCode) {
            const affiliate = await Affiliate.findOne({ affiliateCode: affCode, status: 'approved' });
            if (affiliate) {
                const commission = amount * 0.08; // 8% commission
                await AffiliateTransaction.create({
                    affiliateId: affiliate._id,
                    userId: affiliate.userId,
                    productId,
                    amount,
                    commission,
                });
            }
        }

        return NextResponse.json({ message: 'Purchase recorded' }, { status: 201 });
    } catch (error) {
        console.error('Purchase affiliate error:', error);
        return NextResponse.json({ message: 'Failed to record purchase', error: error.message }, { status: 500 });
    }
}