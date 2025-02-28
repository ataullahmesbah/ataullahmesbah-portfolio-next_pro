import dbConnect from "@/lib/dbMongoose";
import Blog from "./Blog";



export async function getAllPages() {
    await dbConnect();

    try {
        const blogs = await Blog.find({}, { slug: 1, _id: 0 }); // Fetch only slugs
        return blogs.map((blog) => ({ slug: blog.slug }));
    } catch (error) {
        console.error('Failed to fetch pages:', error);
        return [];
    }
}