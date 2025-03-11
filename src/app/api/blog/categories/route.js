// src/app/api/blog/categories/route.js

import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";

export async function GET(request) {
    await dbConnect();
    try {
      // Fetch all blogs
      const blogs = await Blog.find({});
  
      // Extract unique categories from all blogs
      const categories = [...new Set(blogs.flatMap(blog => blog.categories))];
  
      // Return the categories as a JSON response
      return new Response(JSON.stringify(categories), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }