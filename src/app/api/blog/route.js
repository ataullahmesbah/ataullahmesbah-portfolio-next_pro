// app/api/blog/route.js

import dbConnect from "@/lib/dbMongoose";
import Blog from "@/models/Blog";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from 'next/server';


export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 9;
        const skip = (page - 1) * limit;

        console.log('🔍 Fetching all blogs from database...');

        // ✅ Remove status condition since it doesn't exist in your model
        const blogs = await Blog.find({})
            .select('title slug mainImage metaDescription categories publishDate views readTime')
            .skip(skip)
            .limit(limit)
            .sort({ publishDate: -1 })
            .lean();

        const totalBlogs = await Blog.countDocuments({});

        console.log(`✅ Fetched ${blogs.length} blogs, total: ${totalBlogs}`);

        if (blogs.length > 0) {
            console.log('📝 Blog titles:', blogs.map(blog => blog.title));
        } else {
            console.log('📝 No blogs found in database');
        }

        // Add default values if needed
        const blogsWithDefaults = blogs.map(blog => ({
            ...blog,
            views: blog.views || 0,
            readingTime: blog.readTime ? `${blog.readTime} min read` : '5 min read',
            categories: blog.categories || ['Uncategorized']
        }));

        return NextResponse.json({
            success: true,
            blogs: blogsWithDefaults,
            currentPage: page,
            totalPages: Math.ceil(totalBlogs / limit),
            totalBlogs
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
            }
        });
    } catch (error) {
        console.error('❌ GET /api/blog error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch blogs',
            details: error.message
        }, { status: 500 });
    }
}


export async function POST(req) {
    await dbConnect();
    try {
        const formData = await req.formData();

        // Validate required fields
        const requiredFields = ['title', 'slug', 'author', 'metaTitle', 'metaDescription'];
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
                    {
                        folder: 'main image',
                        fetch_format: 'webp',
                        quality: 'auto',
                        width: 1200,
                        height: 628,
                        crop: 'fill',
                    },
                    (error, result) => error ? reject(error) : resolve(result)
                ).end(buffer);
            });
            mainImageUrl = result.secure_url;
        } else {
            return NextResponse.json(
                { success: false, error: 'Main image is required' },
                { status: 400 }
            );
        }

        // Process content sections
        const content = JSON.parse(formData.get('content') || '[]');
        const contentImages = formData.getAll('contentImages');
        let imageIndex = 0;

        const processedContent = await Promise.all(
            content.map(async (item) => {
                if (item.type === 'image') {
                    const imageFile = contentImages[imageIndex];
                    imageIndex++;
                    if (imageFile && imageFile.size > 0) {
                        const arrayBuffer = await imageFile.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        const result = await new Promise((resolve, reject) => {
                            cloudinary.uploader.upload_stream(
                                {
                                    folder: 'blog_images/content',
                                    fetch_format: 'webp',
                                    quality: 'auto',
                                    width: 800,
                                    height: 600,
                                    crop: 'fill',
                                },
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
                    // Validate text content with optional markdown hyperlinks
                    if (!item.data?.trim()) {
                        throw new Error('Text content cannot be empty');
                    }
                    // Optional: Validate markdown syntax (basic check for [text](url))
                    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
                    if (item.data.match(markdownLinkRegex)) {
                        console.log('Markdown hyperlinks detected in text:', item.data);
                    }
                    return {
                        type: 'text',
                        data: item.data, // Store markdown as-is
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

        // Create new blog
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
            structuredData: formData.get('structuredData') || '',
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