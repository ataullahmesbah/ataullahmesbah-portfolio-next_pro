import dbConnect from "@/lib/dbMongoose";
import Content from "@/models/Content";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function PUT(request, { params }) {
    await dbConnect();
    const { slug } = params;
    const { title, description, link, platform } = await request.json();
    const newSlug = title ? slugify(title, { lower: true, strict: true }) : slug;

    const updatedContent = await Content.findOneAndUpdate(
        { slug },
        { title, slug: newSlug, description, link, platform },
        { new: true }
    );
    if (!updatedContent) return NextResponse.json({ error: "Content not found" }, { status: 404 });
    return NextResponse.json(updatedContent);
}