// src/app/api/blogs/[id]/route.js


import { connectDB } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export const GET = async (req, { params }) => {
    const db = await connectDB();
    const collection = db.collection("blogs");
    const blog = await collection.findOne({ _id: new ObjectId(params.id) });

    if (!blog) {
        return new Response(JSON.stringify({ error: "Blog not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(blog), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};
