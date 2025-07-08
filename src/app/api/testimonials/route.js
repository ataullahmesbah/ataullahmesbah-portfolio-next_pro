import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Testimonial from "@/models/Testimonial";
import cloudinary from "@/utils/cloudinary";
import dbConnect from "@/lib/dbMongoose";

export async function GET() {
    try {
        await dbConnect();
        const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json(testimonials, { status: 200 });
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return NextResponse.json(
            { error: "Failed to fetch testimonials", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const formData = await req.formData();

        // Extract form data
        const user_name = formData.get('user_name') && formData.get('user_name').toString().trim();
        const user_position = (formData.get('user_position') && formData.get('user_position').toString().trim()) || "Customer";
        const rating = parseFloat(formData.get('rating') && formData.get('rating').toString());
        const description = formData.get('description') && formData.get('description').toString().trim();
        const categoriesString = formData.get('categories') && formData.get('categories').toString();
        const categories = categoriesString ? categoriesString.split(',').map(function(cat) { return cat.trim(); }).filter(function(cat) { return cat; }) : [];
        const imageFile = formData.get('image');

        // Validate required fields
        if (!user_name || !description || !imageFile || !categories.length) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (isNaN(rating)) {
            return NextResponse.json(
                { error: "Invalid rating format" },
                { status: 400 }
            );
        }

        // Upload image to Cloudinary
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadResult = await new Promise(function(resolve, reject) {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'testimonials',
                    format: 'webp',
                    transformation: [{ width: 500, height: 500, crop: 'fill' }]
                },
                function(error, result) {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        if (!uploadResult || !uploadResult.secure_url) {
            throw new Error("Cloudinary upload failed");
        }

        // Create testimonial
        const newTestimonial = await Testimonial.create({
            user_name: user_name,
            user_position: user_position,
            rating: rating,
            description: description,
            image: uploadResult.secure_url,
            categories: categories,
            createdAt: new Date()
        });

        return NextResponse.json(
            { message: "Testimonial added successfully", testimonial: newTestimonial },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error adding testimonial:", error);
        return NextResponse.json(
            {
                error: "Failed to add testimonial",
                details: error.message,
                validationErrors: error.errors
            },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const id = body.id;

        if (!id) {
            return NextResponse.json(
                { error: "Missing testimonial ID" },
                { status: 400 }
            );
        }

        // Find and delete testimonial
        const testimonial = await Testimonial.findByIdAndDelete(id);
        if (!testimonial) {
            return NextResponse.json(
                { error: "Testimonial not found" },
                { status: 404 }
            );
        }

        // Delete image from Cloudinary
        if (testimonial.image) {
            const parts = testimonial.image.split('/');
            const publicId = parts.slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        return NextResponse.json(
            { message: "Testimonial deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return NextResponse.json(
            { error: "Failed to delete testimonial", details: error.message },
            { status: 500 }
        );
    }
}