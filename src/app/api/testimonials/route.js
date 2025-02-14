
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectDB } from "@/lib/dbConnect";

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
        const { user_name, user_position, rating, description, image, categories } = body;

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
            categories,
        };

        const result = await db.collection("testimonials").insertOne(newTestimonial);
        return NextResponse.json({ message: "Testimonial added successfully", result }, { status: 201 });
    } catch (error) {
        console.error("Error adding testimonial:", error);
        return NextResponse.json({ error: "Failed to add testimonial" }, { status: 500 });
    }
}


// DELETE Testimonial
export async function DELETE(req) {
    try {
        const db = await connectDB();
        const { id } = await req.json();

        // Validate ID
        if (!id) {
            return NextResponse.json({ error: "Missing testimonial ID" }, { status: 400 });
        }

        // Convert ID to ObjectId
        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch (error) {
            return NextResponse.json({ error: "Invalid testimonial ID" }, { status: 400 });
        }

        // Delete document
        const result = await db.collection("testimonials").deleteOne({ _id: objectId });

        if (result.deletedCount === 1) {
            return NextResponse.json({ message: "Testimonial deleted successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
    }
}