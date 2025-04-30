// src/app/api/blog/categories/route.js

import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";


export async function GET() {
  await dbConnect();
  try {
    // More efficient if you have many blogs
    const categories = await Blog.distinct('categories');
    return new Response(JSON.stringify(categories), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}