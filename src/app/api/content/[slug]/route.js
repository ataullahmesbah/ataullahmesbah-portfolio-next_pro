import { NextResponse } from "next/server";
import Content from "@/models/Content";
import dbConnect from "@/lib/dbMongoose";
import slugify from "slugify";

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { slug } = params;
        const content = await Content.findOneAndDelete({ slug });
        if (!content) return NextResponse.json({ error: "Content not found" }, { status: 404 });
        return NextResponse.json({ message: "Content deleted" }, { status: 200 });
    } catch (error) {
     
        return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { slug } = params;
        const { title, description, link, platform } = await request.json();

        if (!title || !description || !link || !platform) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedSlug = slugify(title, { lower: true, strict: true });
        const content = await Content.findOneAndUpdate(
            { slug },
            { title, slug: updatedSlug, description, link, platform },
            { new: true }
        );

        if (!content) return NextResponse.json({ error: "Content not found" }, { status: 404 });
        return NextResponse.json(content, { status: 200 });
    } catch (error) {
      
        return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
    }
}