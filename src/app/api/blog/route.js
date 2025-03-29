// app/api/blog/route.js
import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from 'next/server';



export async function GET(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 6; // Default 6 blogs per page
        const skip = (page - 1) * limit;

        // Fetch blogs with pagination
        const blogs = await Blog.find({})
            .skip(skip)
            .limit(limit)
            .sort({ publishDate: -1 });

        // Get total blogs count for pagination
        const totalBlogs = await Blog.countDocuments();

        return new Response(JSON.stringify({
            blogs,
            totalBlogs,
            currentPage: page,
            totalPages: Math.ceil(totalBlogs / limit),
        }), {
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
        const requiredFields = ['title', 'slug', 'mainImage', 'author', 'metaTitle', 'metaDescription'];
        const missingFields = requiredFields.filter(field => !formData.get(field));
        if (missingFields.length > 0) {
            return NextResponse.json({ success: false, error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
        }

        const mainImageFile = formData.get('mainImage');
        let mainImageUrl = '';
        if (mainImageFile.size > 0) {
            const arrayBuffer = await mainImageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'blog_images', format: 'webp', quality: 'auto' },
                    (error, result) => error ? reject(error) : resolve(result)
                ).end(buffer);
            });
            mainImageUrl = result.secure_url;
        }

        const content = JSON.parse(formData.get('content') || '[]');
        const contentImages = formData.getAll('contentImages');
        let imageIndex = 0;
        const processedContent = await Promise.all(
            content.map(async (item) => {
                if (item.type === 'image') {
                    const imageFile = contentImages[imageIndex++];
                    if (imageFile?.size > 0) {
                        const arrayBuffer = await imageFile.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        const result = await new Promise((resolve, reject) => {
                            cloudinary.uploader.upload_stream(
                                { folder: 'blog_images/content', format: 'webp', quality: 'auto' },
                                (error, result) => error ? reject(error) : resolve(result)
                            ).end(buffer);
                        });
                        return { type: 'image', data: result.secure_url, alt: item.alt || '' };
                    }
                }
                return { type: 'text', data: item.data, bulletPoints: item.bulletPoints || [] };
            })
        );

        const wordCount = processedContent
            .filter(item => item.type === 'text')
            .reduce((count, item) => count + item.data.split(/\s+/).length, 0);
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        const newBlog = new Blog({
            title: formData.get('title'),
            slug: formData.get('slug'),
            mainImage: mainImageUrl,
            shortDescriptions: JSON.parse(formData.get('shortDescriptions') || '[]'),
            author: formData.get('author'),
            content: processedContent,
            keyPoints: JSON.parse(formData.get('keyPoints') || '[]'),
            publishDate: new Date(formData.get('publishDate') || Date.now()),
            metaTitle: formData.get('metaTitle'),
            metaDescription: formData.get('metaDescription'),
            tags: JSON.parse(formData.get('tags') || '[]'),
            categories: JSON.parse(formData.get('categories') || '[]'),
            readTime,
        });

        await newBlog.save();
        return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
    } catch (error) {
        console.error('Blog creation error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to create blog post' }, { status: 500 });
    }
}

export async function PUT(req) {
    await dbConnect();
    try {
        const formData = await req.formData();
        const slug = formData.get('slug');
        if (!slug) return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });

        const blog = await Blog.findOne({ slug });
        if (!blog) return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });

        if (formData.get('title')) blog.title = formData.get('title');
        if (formData.get('metaTitle')) blog.metaTitle = formData.get('metaTitle');
        if (formData.get('metaDescription')) blog.metaDescription = formData.get('metaDescription');
        if (formData.get('shortDescriptions')) blog.shortDescriptions = JSON.parse(formData.get('shortDescriptions') || '[]');
        if (formData.get('author')) blog.author = formData.get('author');

        const mainImageFile = formData.get('mainImage');
        if (mainImageFile && mainImageFile.size > 0) {
            const arrayBuffer = await mainImageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: 'blog_images', format: 'webp', quality: 'auto' },
                    (error, result) => error ? reject(error) : resolve(result)
                ).end(buffer);
            });
            blog.mainImage = result.secure_url;
        }

        const content = JSON.parse(formData.get('content') || '[]');
        if (content.length > 0) {
            const contentImages = formData.getAll('contentImages');
            let imageIndex = 0;
            blog.content = await Promise.all(
                content.map(async (item) => {
                    if (item.type === 'image') {
                        const imageFile = contentImages[imageIndex++];
                        if (imageFile?.size > 0) {
                            const arrayBuffer = await imageFile.arrayBuffer();
                            const buffer = Buffer.from(arrayBuffer);
                            const result = await new Promise((resolve, reject) => {
                                cloudinary.uploader.upload_stream(
                                    { folder: 'blog_images/content', format: 'webp', quality: 'auto' },
                                    (error, result) => error ? reject(error) : resolve(result)
                                ).end(buffer);
                            });
                            return { type: 'image', data: result.secure_url, alt: item.alt || '' };
                        }
                        return blog.content.find(c => c.type === 'image') || item; // Retain existing if no new image
                    }
                    return { type: 'text', data: item.data, bulletPoints: item.bulletPoints || [] };
                })
            );
        }

        if (formData.get('keyPoints')) blog.keyPoints = JSON.parse(formData.get('keyPoints') || '[]');
        if (formData.get('tags')) blog.tags = JSON.parse(formData.get('tags') || '[]');
        if (formData.get('categories')) blog.categories = JSON.parse(formData.get('categories') || '[]');

        const wordCount = blog.content
            .filter(item => item.type === 'text')
            .reduce((count, item) => count + item.data.split(/\s+/).length, 0);
        blog.readTime = Math.max(1, Math.ceil(wordCount / 200));

        await blog.save();
        return NextResponse.json({ success: true, data: blog }, { status: 200 });
    } catch (error) {
        console.error('Blog update error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to update blog' }, { status: 500 });
    }
}

// Other handlers (GET, DELETE) remain unchanged

// Keep GET and DELETE as they are

export async function DELETE(request) {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    try {
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