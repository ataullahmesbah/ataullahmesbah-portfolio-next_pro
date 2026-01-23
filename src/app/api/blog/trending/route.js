// app/api/blog/trending/route.js
import dbConnect from '@/lib/dbMongoose';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';


export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit')) || 4;

        // Get trending blogs based on views (most viewed blogs)
        const trendingBlogs = await Blog.find({})
            .select('title slug views categories')
            .sort({ views: -1, publishDate: -1 })
            .limit(limit)
            .lean();



        return NextResponse.json({
            success: true,
            blogs: trendingBlogs
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900'
            }
        });
    } catch (error) {


        // Fallback dummy data if database fails
        const fallbackBlogs = [
            {
                title: "Next.js 14 Complete Guide",
                slug: "nextjs-14-complete-guide",
                views: 1247,
                categories: ["Web Development"]
            },
            {
                title: "AI Revolution in 2024",
                slug: "ai-revolution-2024",
                views: 987,
                categories: ["Artificial Intelligence"]
            },
            {
                title: "Quantum Computing Basics",
                slug: "quantum-computing-basics",
                views: 756,
                categories: ["Quantum Tech"]
            },
            {
                title: "React Performance Tips",
                slug: "react-performance-tips",
                views: 632,
                categories: ["Frontend"]
            }
        ];

        return NextResponse.json({
            success: true,
            blogs: fallbackBlogs
        });
    }
}