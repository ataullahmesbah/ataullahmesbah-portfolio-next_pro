

// app/api/affiliate/payout/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Affiliate from '@/models/Affiliate';
import AffiliatePayout from '@/models/AffiliatePayout';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';


export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { affiliateId, amount } = await request.json();
        if (!affiliateId || !amount || amount <= 0) {
            return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
        }

        await dbConnect();
        const affiliate = await Affiliate.findById(affiliateId);
        if (!affiliate || affiliate.status !== 'approved') {
            return NextResponse.json({ message: 'Invalid affiliate' }, { status: 404 });
        }

        const payout = await AffiliatePayout.create({
            affiliateId,
            userId: affiliate.userId,
            amount,
            status: 'pending',
        });

        return NextResponse.json({ message: 'Payout initiated', payout }, { status: 201 });
    } catch (error) {
        console.error('Payout error:', error);
        return NextResponse.json({ message: 'Failed to initiate payout', error: error.message }, { status: 500 });
    }
}