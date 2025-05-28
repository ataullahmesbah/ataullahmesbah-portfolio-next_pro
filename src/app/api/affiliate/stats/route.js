

// app/api/affiliate/stats/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Affiliate from '@/models/Affiliate';
import AffiliateTransaction from '@/models/AffiliateTransaction';
import AffiliateVisit from '@/models/AffiliateVisit';
import AffiliatePayout from '@/models/AffiliatePayout';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

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
                $lookup: {
                    from: 'affiliatetransactions',
                    localField: '_id',
                    foreignField: 'affiliateId',
                    as: 'transactions',
                },
            },
            {
                $lookup: {
                    from: 'affiliatevisits',
                    localField: '_id',
                    foreignField: 'affiliateId',
                    as: 'visits',
                },
            },
            {
                $lookup: {
                    from: 'affiliatepayouts',
                    localField: '_id',
                    foreignField: 'affiliateId',
                    as: 'payouts',
                },
            },
            {
                $project: {
                    _id: 1,
                    username: '$user.username',
                    email: '$user.email',
                    affiliateCode: 1,
                    totalEarnings: { $sum: '$transactions.commission' },
                    totalSales: { $size: '$transactions' },
                    totalVisits: { $size: '$visits' },
                    totalPayouts: { $sum: '$payouts.amount' },
                    visitsByPage: {
                        $arrayToObject: {
                            $map: {
                                input: { $setUnion: ['$visits.visitedPage'] },
                                as: 'page',
                                in: {
                                    k: '$$page',
                                    v: {
                                        $size: {
                                            $filter: {
                                                input: '$visits',
                                                as: 'visit',
                                                cond: { $eq: ['$$visit.visitedPage', '$$page'] },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    earningsByDate: {
                        $arrayToObject: {
                            $map: {
                                input: { $setUnion: [{ $dateToString: { format: '%Y-%m-%d', date: '$transactions.createdAt' } }] },
                                as: 'date',
                                in: {
                                    k: '$$date',
                                    v: {
                                        $sum: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: '$transactions',
                                                        as: 'transaction',
                                                        cond: {
                                                            $eq: [
                                                                { $dateToString: { format: '%Y-%m-%d', date: '$$transaction.createdAt' } },
                                                                '$$date',
                                                            ],
                                                        },
                                                    },
                                                },
                                                as: 'transaction',
                                                in: '$$transaction.commission',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    payoutsByStatus: {
                        $arrayToObject: {
                            $map: {
                                input: ['pending', 'completed', 'failed'],
                                as: 'status',
                                in: {
                                    k: '$$status',
                                    v: {
                                        $sum: {
                                            $map: {
                                                input: {
                                                    $filter: {
                                                        input: '$payouts',
                                                        as: 'payout',
                                                        cond: { $eq: ['$$payout.status', '$$status'] },
                                                    },
                                                },
                                                as: 'payout',
                                                in: '$$payout.amount',
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ]);

        return NextResponse.json(affiliates);
    } catch (error) {
        console.error('Fetch affiliate stats error:', error);
        return NextResponse.json({ message: 'Failed to fetch stats', error: error.message }, { status: 500 });
    }
}