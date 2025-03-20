// app/api/blog/route.js
import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from 'next/server';

export async function GET(request) {
    await dbConnect();
    try {
        const blogs = await Blog.find({});
        return new Response(JSON.stringify(blogs), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch blogs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}



export async function POST(req) {
    await dbConnect();

    try {
        const formData = await req.formData();

        // Extract fields from form data
        const title = formData.get('title');
        const slug = formData.get('slug');
        const mainImageFile = formData.get('mainImage');
        const shortDescription = formData.get('shortDescription');
        const metaDescription = formData.get('metaDescription'); // New field
        const author = formData.get('author');
        const publishDate = formData.get('publishDate');
        const metaTitle = formData.get('metaTitle');
        const auth = formData.get('auth');

        // Safely parse JSON fields
        const content = JSON.parse(formData.get('content') || '[]');
        const keyPoints = JSON.parse(formData.get('keyPoints') || '[]');
        const tags = JSON.parse(formData.get('tags') || '[]');
        const categories = JSON.parse(formData.get('categories') || '[]');

        // Upload main image to Cloudinary if exists
        let mainImageUrl = '';
        if (mainImageFile && mainImageFile.size > 0) {
            const arrayBuffer = await mainImageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'blog_images' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            mainImageUrl = result.secure_url;
        }

        // Upload images in content blocks to Cloudinary
        const updatedContent = await Promise.all(
            content.map(async (block, index) => {
                if (block.type === 'image') {
                    // Find the corresponding image file in FormData
                    const imageFile = formData.get(`contentImages_${index}`);
                    if (imageFile && imageFile.size > 0) {
                        const arrayBuffer = await imageFile.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        const result = await new Promise((resolve, reject) => {
                            cloudinary.uploader.upload_stream(
                                { folder: 'blog_images' },
                                (error, result) => {
                                    if (error) reject(error);
                                    else resolve(result);
                                }
                            ).end(buffer);
                        });

                        return {
                            ...block,
                            data: result.secure_url, // Replace file object with image URL
                        };
                    }
                }
                return block; // Return text blocks as-is
            })
        );

        // Create the blog post
        const newBlog = new Blog({
            title,
            slug,
            mainImage: mainImageUrl,
            shortDescription,
            metaDescription, // Save the new metaDescription field
            author,
            content: updatedContent, // Use the updated content with image URLs
            keyPoints,
            publishDate: new Date(publishDate),
            metaTitle,
            tags,
            categories,
            auth,
        });

        await newBlog.save();

        return NextResponse.json({
            message: 'Blog post created successfully',
            blog: newBlog,
        });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }
}



// DELETE BLOG LIST

export async function DELETE(request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    try {
        // Delete the blog by slug
        const result = await Blog.deleteOne({ slug });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ error: 'Blog not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return new Response(JSON.stringify({ error: 'Failed to delete blog' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}