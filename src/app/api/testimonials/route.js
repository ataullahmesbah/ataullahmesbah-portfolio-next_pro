
import { connectDB } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// GET Testimonials
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

// POST Testimonials
export async function POST(req) {
    try {
        const db = await connectDB();
        const body = await req.json();
        const { user_name, user_position, rating, description, image } = body;

        if (!user_name || !rating || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newTestimonial = {
            user_name,
            user_position: user_position || "Customer",
            rating: parseFloat(rating),
            description,
            image: image || null,
            createdAt: new Date(),
        };

        const result = await db.collection("testimonials").insertOne(newTestimonial);
        return NextResponse.json({ message: "Testimonial added successfully", result }, { status: 201 });
    } catch (error) {
        console.error("Error adding testimonial:", error);
        return NextResponse.json({ error: "Failed to add testimonial" }, { status: 500 });
    }
}
