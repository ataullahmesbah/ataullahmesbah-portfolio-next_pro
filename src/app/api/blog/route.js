import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";

export async function GET(request) {
    await dbConnect();
    try {
        const blogs = await Blog.find({});
        return new Response(JSON.stringify(blogs), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch blogs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function POST(request) {
    await dbConnect();
    const body = await request.json();
    const blog = new Blog(body);
    await blog.save();
    return new Response(JSON.stringify(blog), {
        headers: { 'Content-Type': 'application/json' },
    });
}