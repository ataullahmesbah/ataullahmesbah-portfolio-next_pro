import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import FeaturedStory from '@/models/FeaturedStory';

export async function GET(request) {
    try {
        await dbConnect();
        console.log('Fetching statistics from /api/feature/statistics'); // Debug log

        // Total Stories
        const totalStories = await FeaturedStory.countDocuments();

        // Total Views
        const totalViews = await FeaturedStory.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } },
        ]);

        // Published vs Draft Stories
        const statusCounts = await FeaturedStory.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        // Stories by Category
        const categoryCounts = await FeaturedStory.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        // Top 5 Viewed Stories
        const topStories = await FeaturedStory.find()
            .sort({ views: -1 })
            .limit(5)
            .select('title slug views mainImage')
            .lean();

        // Stories Published Over Time (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const storiesOverTime = await FeaturedStory.aggregate([
            { $match: { publishedDate: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$publishedDate' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const response = {
            totalStories: totalStories || 0,
            totalViews: totalViews[0]?.totalViews || 0,
            statusCounts: statusCounts.reduce((acc, curr) => {
                acc[curr._id || 'unknown'] = curr.count;
                return acc;
            }, {}),
            categoryCounts: categoryCounts.map(c => ({
                category: c._id || 'uncategorized',
                count: c.count,
            })),
            topStories: topStories || [],
            storiesOverTime: storiesOverTime.map(s => ({ date: s._id, count: s.count })),
        };

        console.log('Statistics fetched:', response); // Debug log
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('GET /api/feature/statistics error:', error);
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }
}