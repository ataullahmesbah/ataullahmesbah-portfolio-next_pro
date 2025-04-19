import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Affiliate from '@/models/Affiliate';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';

        await dbConnect();
        const affiliates = await Affiliate.aggregate([
            { $match: { status: 'approved' } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $match: search
                    ? {
                        $or: [
                            { 'user.username': { $regex: search, $options: 'i' } },
                            { 'user.email': { $regex: search, $options: 'i' } },
                        ],
                    }
                    : {},
            },
            {
                $lookup: {
                    from: 'affiliatetransactions',
                    localField: '_id',
                    foreignField: 'affiliateId',
                    as: 'transactions',
                },
            },
            {
                $project: {
                    _id: 1,
                    userId: '$user._id',
                    username: '$user.username',
                    email: '$user.email',
                    affiliateCode: 1,
                    totalEarnings: { $sum: '$transactions.commission' },
                    totalSales: { $size: '$transactions' },
                },
            },
        ]);

        console.log('All affiliates fetched:', affiliates); // Debug
        return NextResponse.json(affiliates);
    } catch (error) {
        console.error('Fetch all affiliates error:', error);
        return NextResponse.json({ message: 'Failed to fetch affiliates', error: error.message }, { status: 500 });
    }
}