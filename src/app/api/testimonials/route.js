import { connectDB } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const db = await connectDB();
        const testimonials = await db.collection("testimonials").find().toArray();

        return NextResponse.json(testimonials, { status: 200 });
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
    }
}
