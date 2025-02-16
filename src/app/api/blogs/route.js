// app/api/blogs/route.js

import { connectDB } from "@/lib/dbConnect";



export const GET = async () => {
    const db = await connectDB();
    const collection = db.collection("blogs");
    const blogs = await collection.find({}).sort({ publishedAt: -1 }).toArray();

    return new Response(JSON.stringify(blogs), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};

export const POST = async (req) => {
    const body = await req.json();
    const { title, slug, subtitle, description, author, categories, image, seo } = body;

    if (!title || !slug || !description) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const db = await connectDB();
    const collection = db.collection("blogs");

    const newBlog = {
        title,
        slug,
        subtitle,
        description,
        author,
        categories,
        image,
        seo,
        publishedAt: new Date(),
        updatedAt: new Date(),
        views: 0,
    };

    const result = await collection.insertOne(newBlog);
    return new Response(JSON.stringify({ message: "Blog created", blogId: result.insertedId }), { status: 201 });
};
