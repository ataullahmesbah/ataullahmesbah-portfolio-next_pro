import { connectDB } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


// GET Testimonials
export async function GET() {
    try {
        const db = await connectDB();
        const testimonials = await db
            .collection("testimonials")
            .find({})
            .project({ rating: 1, categories: 1 }) // Only fetch necessary fields
            .toArray();

        return NextResponse.json(testimonials, {
            status: 200,
            headers: {
                'Cache-Control': 's-maxage=3600, stale-while-revalidate' // Add caching
            }
        });
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch testimonials",
                message: error.message
            },
            { status: 500 }
        );
    }
}