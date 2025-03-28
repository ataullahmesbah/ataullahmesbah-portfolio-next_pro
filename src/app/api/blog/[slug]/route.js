// src/app/api/blog/[slug]/route.js

import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";


export async function GET(request, { params }) {
    await dbConnect();

    try {
        const blog = await Blog.findOne({ slug: params.slug });
        if (!blog) {
            return new Response(JSON.stringify({ error: 'Blog not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify(blog), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch blog' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}