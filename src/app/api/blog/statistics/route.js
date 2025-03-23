import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";

export async function GET(request) {
  await dbConnect();

  try {
    // Total Blogs
    const totalBlogs = await Blog.countDocuments({});
    console.log('Total Blogs:', totalBlogs);

    // Blogs by Category
    const blogsByCategory = await Blog.aggregate([
      { $unwind: { path: "$categories", preserveNullAndEmptyArrays: true } },
      { $group: { _id: { $ifNull: ["$categories", "Uncategorized"] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    console.log('Blogs by Category:', blogsByCategory);

    // Most Popular Blogs (by views)
    const popularBlogsRaw = await Blog.find({})
      .select('title views')
      .sort({ views: -1 })
      .limit(5)
      .lean();
    const popularBlogs = popularBlogsRaw.map(blog => ({
      ...blog,
      views: Number(blog.views || 0), // Ensure views is a number
    }));
    console.log('Popular Blogs:', popularBlogs);

    // Recent Blogs (by publishDate)
    const latestBlogsRaw = await Blog.find({})
      .select('title views publishDate')
      .sort({ publishDate: -1 })
      .limit(5)
      .lean();
    const latestBlogs = latestBlogsRaw.map(blog => ({
      ...blog,
      views: Number(blog.views || 0), // Ensure views is a number
      publishDate: blog.publishDate ? new Date(blog.publishDate).toLocaleDateString() : 'N/A',
    }));
    console.log('Latest Blogs:', latestBlogs);

    const responseData = {
      totalBlogs: totalBlogs || 0,
      blogsByCategory: blogsByCategory || [],
      popularBlogs: popularBlogs || [],
      latestBlogs: latestBlogs || [],
    };

    console.log('Final Response Data:', responseData);
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error("Error fetching blog statistics:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch statistics', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}