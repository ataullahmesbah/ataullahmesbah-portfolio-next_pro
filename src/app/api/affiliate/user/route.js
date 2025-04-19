import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbMongoose';
import Affiliate from '@/models/Affiliate';
import AffiliateTransaction from '@/models/AffiliateTransaction';



export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id') || session.user.id;

        // Restrict non-admins to their own data
        if (userId !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const affiliate = await Affiliate.findOne({ userId }).populate('userId', 'name email');
        const transactions = await AffiliateTransaction.find({ userId }).populate('productId', 'name');

        console.log('User session:', session); // Debug
        console.log('Affiliate data:', { affiliate, transactions }); // Debug

        return NextResponse.json({ affiliate, transactions });
    } catch (error) {
        console.error('Fetch affiliate user error:', error);
        return NextResponse.json({ message: 'Failed to fetch affiliate data', error: error.message }, { status: 500 });
    }
}