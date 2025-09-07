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

        // Validate required fields
        const requiredFields = ['title', 'slug', 'mainImage', 'author', 'metaTitle', 'metaDescription'];
        const missingFields = requiredFields.filter(field => !formData.get(field));
        if (missingFields.length > 0) {
            return NextResponse.json(
                { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        // Upload main image
        const mainImageFile = formData.get('mainImage');
        let mainImageUrl = '';
        if (mainImageFile && mainImageFile.size > 0) {
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

        // Process content sections
        const content = JSON.parse(formData.get('content') || '[]');
        const contentImages = formData.getAll('contentImages');
        let imageIndex = 0;

        const processedContent = await Promise.all(
            content.map(async (item) => {
                if (item.type === 'image') {
                    // Image processing logic
                    const imageFile = contentImages[imageIndex];
                    imageIndex++;
                    if (imageFile && imageFile.size > 0) {
                        const arrayBuffer = await imageFile.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        const result = await new Promise((resolve, reject) => {
                            cloudinary.uploader.upload_stream(
                                { folder: 'blog_images/content', format: 'webp', quality: 'auto' },
                                (error, result) => error ? reject(error) : resolve(result)
                            ).end(buffer);
                        });
                        return {
                            type: 'image',
                            data: result.secure_url,
                            alt: item.alt || '',
                            tag: 'image'
                        };
                    }
                    throw new Error('Image file missing for image content section');
                } else if (item.type === 'link') {
                    // Link processing logic
                    if (!item.data?.trim() || !item.href?.trim()) {
                        throw new Error('Link content and href cannot be empty');
                    }
                    return {
                        type: 'link',
                        data: item.data,
                        tag: 'a',
                        href: item.href,
                        target: item.target || '_blank'
                    };
                } else {
                    // Text processing logic - convert markdown links to proper format
                    if (!item.data?.trim()) {
                        throw new Error('Text content cannot be empty');
                    }

                    // Convert markdown-style links to proper format for storage
                    const textWithProcessedLinks = item.data;

                    return {
                        type: 'text',
                        data: textWithProcessedLinks,
                        tag: item.tag || 'p',
                        bulletPoints: item.bulletPoints || []
                    };
                }
            })
        );
        // Calculate read time
        const wordCount = processedContent
            .filter(item => item.type === 'text')
            .reduce((count, item) => count + item.data.split(/\s+/).length, 0);
        const readTime = Math.max(1, Math.ceil(wordCount / 200));


        // Create new blog with all SEO fields
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
            // SEO fields
            faqs: JSON.parse(formData.get('faqs') || '[]'),
            lsiKeywords: JSON.parse(formData.get('lsiKeywords') || '[]'),
            semanticRelatedTerms: JSON.parse(formData.get('semanticRelatedTerms') || '[]'),
            geoLocation: JSON.parse(formData.get('geoLocation') || '{}'),
            language: formData.get('language') || 'en',
            sgeOptimized: formData.get('sgeOptimized') === 'true',
            conversationalPhrases: JSON.parse(formData.get('conversationalPhrases') || '[]'),
            directAnswers: JSON.parse(formData.get('directAnswers') || '[]'),
            expertAuthor: formData.get('expertAuthor') === 'true',
            authorCredentials: formData.get('authorCredentials') || '',
            citations: JSON.parse(formData.get('citations') || '[]'),
        });

        await newBlog.save();
        return NextResponse.json(
            { success: true, data: newBlog },
            { status: 201 }
        );
    } catch (error) {
        console.error('Blog creation error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create blog post' },
            { status: 500 }
        );
    }
}




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