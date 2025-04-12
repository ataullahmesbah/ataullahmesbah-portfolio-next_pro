import { NextResponse } from 'next/server';
import slugify from 'slugify';
import cloudinary from '@/utils/cloudinary';
import FeaturedStory from '@/models/FeaturedStory';
import dbConnect from '@/lib/dbMongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';


export async function GET() {
    try {
        await dbConnect();
        const stories = await FeaturedStory.find({ status: 'published' })
            .sort({ publishedDate: -1 })
            .populate('author', 'name email');
        return NextResponse.json(stories);
    } catch (error) {
        console.error('GET /api/feature error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stories' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        await dbConnect();
        const formData = await request.formData();

        // Extract all fields
        const title = formData.get('title');
        const metaDescription = formData.get('metaDescription');
        const description = formData.get('description');
        const contentRaw = formData.get('content');
        const imageFile = formData.get('image');
        const category = formData.get('category');
        const tags = formData.get('tags')?.split(',').map(t => t.trim()).filter(t => t) || [];
        const metaTitle = formData.get('metaTitle');
        const keyPoints = formData.get('keyPoints')?.split('|').map(k => k.trim()).filter(k => k) || [];

        // Validate required fields
        if (!title || !metaDescription || !description || !imageFile || !metaTitle) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Parse and validate content
        let content;
        try {
            content = JSON.parse(contentRaw);
            if (!Array.isArray(content) || content.length === 0) {
                throw new Error('Content must be a non-empty array');
            }
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid content format' },
                { status: 400 }
            );
        }

        // Convert image file to buffer
        const imageBuffer = await imageFile.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);

        // Upload image to Cloudinary
        const uploadResult = await new Promise((resolve) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    format: 'webp',
                    quality: 'auto:good'
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return resolve(null);
                    }
                    resolve(result);
                }
            ).end(imageData);
        });

        if (!uploadResult) {
            return NextResponse.json(
                { error: 'Failed to upload image' },
                { status: 500 }
            );
        }

        // Create slug
        const slug = title.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Create new story
        const story = new FeaturedStory({
            title,
            slug,
            metaDescription,
            description,
            image: uploadResult.secure_url,
            content,
            category,
            tags,
            metaTitle,
            author: session.user.id,
            keyPoints,
            status: 'published'
        });

        await story.save();

        return NextResponse.json(
            { message: 'Story created successfully', story },
            { status: 201 }
        );

    } catch (error) {
        console.error('POST /api/feature error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}