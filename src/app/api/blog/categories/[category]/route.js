// src/app/api/blog/categories/[category]/route.js

import { NextResponse } from 'next/server';
import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";


export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 9;
        const skip = (page - 1) * limit;

        const categoryName = decodeURIComponent(params.category).replace(/-/g, ' ');


        // ✅ Remove status condition
        const blogs = await Blog.find({
            categories: {
                $elemMatch: {
                    $regex: new RegExp(categoryName, 'i')
                }
            }
        })
            .select('title slug mainImage metaDescription categories publishDate views readTime')
            .skip(skip)
            .limit(limit)
            .sort({ publishDate: -1 })
            .lean();

        const total = await Blog.countDocuments({
            categories: {
                $elemMatch: {
                    $regex: new RegExp(categoryName, 'i')
                }
            }
        });



        // Add default values
        const blogsWithDefaults = blogs.map(blog => ({
            ...blog,
            views: blog.views || 0,
            readingTime: blog.readTime ? `${blog.readTime} min read` : '5 min read',
            categories: blog.categories || ['Uncategorized']
        }));

        return NextResponse.json({
            success: true,
            blogs: blogsWithDefaults,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
            }
        });
    } catch (error) {

        return NextResponse.json({
            success: false,
            blogs: [],
            total: 0,
            error: 'Failed to fetch blogs',
            details: error.message
        }, { status: 500 });
    }
}