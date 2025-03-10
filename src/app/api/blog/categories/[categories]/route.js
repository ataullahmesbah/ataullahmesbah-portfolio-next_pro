import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";

export async function GET(request, { params }) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    try {
        // Fetch blogs filtered by category (case-insensitive)
        const blogs = await Blog.find({ categories: { $regex: new RegExp(params.category, 'i') } })
            .skip((page - 1) * limit) // Pagination: Skip previous pages
            .limit(limit); // Limit the number of blogs per page

        // Get the total number of blogs for pagination
        const total = await Blog.countDocuments({ categories: { $regex: new RegExp(params.category, 'i') } });

        return new Response(JSON.stringify({ blogs, total }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return new Response(JSON.stringify({ error: 'Failed to fetch blogs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}