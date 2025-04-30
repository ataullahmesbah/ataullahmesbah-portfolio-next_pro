// src/app/api/blog/categories/[category]/route.js
import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";

export const revalidate = 3600; // Revalidate every hour

export async function GET(request, { params }) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

        // Decode the category name (replace hyphens with spaces)
        const categoryName = decodeURIComponent(params.category).replace(/-/g, ' ');

        // Create index if it doesn't exist
        await Blog.collection.createIndex({ categories: 1 });

        // Fetch blogs filtered by category (case-insensitive)
        const blogs = await Blog.find({
            categories: {
                $regex: new RegExp(`^${categoryName}$`, 'i')
            }
        })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ publishDate: -1 });

        // Get total count
        const total = await Blog.countDocuments({
            categories: {
                $regex: new RegExp(`^${categoryName}$`, 'i')
            }
        });

        return new Response(JSON.stringify({ blogs, total }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("API Error:", error);
        return new Response(JSON.stringify({
            error: error.message || 'Failed to fetch blogs',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}