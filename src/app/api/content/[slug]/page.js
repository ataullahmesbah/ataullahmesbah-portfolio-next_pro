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


export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { slug } = params;
        const content = await Content.findOneAndDelete({ slug });
        if (!content) return NextResponse.json({ error: "Content not found" }, { status: 404 });
        return NextResponse.json({ message: "Content deleted" }, { status: 200 });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
    }
}