// app/api/blog/trending/route.js
import dbConnect from '@/lib/dbMongoose';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';


export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 3;

        // Get trending blogs based on views and recent activity
        const trendingBlogs = await Blog.find({
            status: 'published',
            views: { $gt: 0 } // Only blogs with views
        })
            .sort({
                views: -1,
                publishDate: -1
            })
            .limit(limit)
            .select('title slug views mainImage categories')
            .lean();

        return NextResponse.json({
            blogs: trendingBlogs
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900' // 30 min cache
            }
        });
    } catch (error) {
        console.error('GET /api/blog/trending error:', error);
        return NextResponse.json({
            error: 'Failed to fetch trending blogs',
            blogs: []
        }, { status: 500 });
    }
}