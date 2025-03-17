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
        const author = formData.get('author');
        const publishDate = formData.get('publishDate');
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
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
            author,
            content: updatedContent, // Use the updated content with image URLs
            keyPoints,
            publishDate: new Date(publishDate),
            metaTitle,
            metaDescription,
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