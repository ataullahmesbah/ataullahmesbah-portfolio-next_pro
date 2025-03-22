import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";

export async function GET(request) {
    await dbConnect();

    try {
   
        const totalBlogs = await Blog.countDocuments({});

        
        const blogsByCategory = await Blog.aggregate([
            { $unwind: "$categories" },
            { $group: { _id: "$categories", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

      
        const popularBlogs = await Blog.find({}).sort({ views: -1 }).limit(5);


        const latestBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);

        
        return new Response(JSON.stringify({
            totalBlogs,
            blogsByCategory,
            popularBlogs,
            latestBlogs
        }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        return new Response(JSON.stringify({ error: 'Failed to fetch statistics' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}