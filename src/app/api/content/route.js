// app/api/content/route.js
import { NextResponse } from "next/server";
import Content from "@/models/Content";
import dbConnect from "@/lib/dbMongoose";

export async function GET() {
    await dbConnect();
    const content = await Content.find();
    return NextResponse.json(content);
}

export async function POST(request) {
    await dbConnect();
    const { title, description, link, platform } = await request.json();
    const slug = slugify(title, { lower: true, strict: true });

    const content = new Content({ title, slug, description, link, platform });
    await content.save();
    return NextResponse.json(content, { status: 201 });
}