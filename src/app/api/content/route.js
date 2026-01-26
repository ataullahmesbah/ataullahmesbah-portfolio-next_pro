import { NextResponse } from "next/server";
import Content from "@/models/Content";
import dbConnect from "@/lib/dbMongoose";
import slugify from "slugify";

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const platform = searchParams.get("platform");

        const query = platform ? { platform } : {};
        const content = await Content.find(query);
        return NextResponse.json(content);
    } catch (error) {

        return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const { title, description, link, platform } = await request.json();

        if (!title || !description || !link || !platform) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const slug = slugify(title, { lower: true, strict: true });
        const content = new Content({ title, slug, description, link, platform });
        await content.save();
        return NextResponse.json(content, { status: 201 });
    } catch (error) {

        return NextResponse.json({ error: "Failed to add content" }, { status: 500 });
    }
}