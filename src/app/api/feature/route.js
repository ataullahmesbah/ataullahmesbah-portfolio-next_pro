import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';
import FeaturedStory from '@/models/FeaturedStory';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbMongoose';

export async function GET() {
    try {
        await dbConnect();
        const stories = await FeaturedStory.find({ status: 'published' })
            .sort({ publishedDate: -1 })
            .populate('author', 'name email');
        return NextResponse.json(stories, { status: 200 });
    } catch (error) {
        console.error('GET /api/featured-stories error:', error);
        return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const formData = await request.formData();

        // Extract fields
        const title = formData.get('title');
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const shortDescription = formData.get('shortDescription');
        const mainImage = formData.get('mainImage');
        const category = formData.get('category');
        const tags = formData.get('tags')?.split(',').map(t => t.trim()).filter(t => t) || [];
        const keyPoints = formData.get('keyPoints')?.split('\n').map(k => k.trim()).filter(k => k) || [];
        const contentBlocksRaw = formData.get('contentBlocks');
        const author = formData.get('author') || '66f4d0b0f1a1b2c3d4e5f6a7'; // Placeholder ObjectId

        // Validate required fields
        if (!title || !metaTitle || !metaDescription || !shortDescription || !mainImage) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Parse and validate contentBlocks
        let contentBlocks;
        try {
            contentBlocks = JSON.parse(contentBlocksRaw);
            if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) {
                throw new Error('Content blocks must be a non-empty array');
            }
            contentBlocks.forEach(block => {
                if (!['paragraph', 'heading', 'image', 'video', 'code'].includes(block.type)) {
                    throw new Error('Invalid block type');
                }
                if (block.type === 'image' && !block.imageUrl) {
                    throw new Error('Image URL required for image blocks');
                }
                if (block.type !== 'image' && !block.content) {
                    throw new Error('Content required for non-image blocks');
                }
                if (block.type === 'heading' && !block.level) {
                    throw new Error('Level required for heading blocks');
                }
            });
        } catch (error) {
            console.error('Content blocks parse error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        // Upload main image to Cloudinary
        const imageBuffer = await mainImage.arrayBuffer();
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);

        const uploadResult = await new Promise((resolve) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    format: 'webp',
                    quality: 'auto:good',
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
            return NextResponse.json({ error: 'Failed to upload main image' }, { status: 500 });
        }

        // Create story
        const story = new FeaturedStory({
            title,
            metaTitle,
            metaDescription,
            shortDescription,
            mainImage: uploadResult.secure_url,
            category,
            tags,
            keyPoints,
            contentBlocks,
            author: new mongoose.Types.ObjectId(author), // Convert to ObjectId
            status: 'published',
        });

        await story.save();

        return NextResponse.json({ message: 'Story created successfully', story }, { status: 201 });
    } catch (error) {
        console.error('POST /api/featured-stories error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}