// api/feature/route.js

import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';
import FeaturedStory from '@/models/FeaturedStory';
import { getServerSession } from 'next-auth';
import slugify from 'slugify';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbMongoose';


export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const excludeId = searchParams.get('excludeId');
    const limit = parseInt(searchParams.get('limit')) || 10;

    const query = { status: 'published' };
    if (category) query.category = category;
    if (excludeId) query._id = { $ne: excludeId };

    const stories = await FeaturedStory.find(query)
      .limit(limit)
      .lean()
      .exec();

    // Ensure contentBlocks is an array for each story
    const sanitizedStories = stories.map(story => ({
      ...story,
      contentBlocks: Array.isArray(story.contentBlocks) ? story.contentBlocks : [],
      views: story.views || 0,
      category: story.category || 'featured',
      tags: story.tags || [],
      keyPoints: story.keyPoints || [],
      author: story.author || 'Ataullah Mesbah',
    }));

    return NextResponse.json({ stories: sanitizedStories }, { status: 200 });
  } catch (error) {
    console.error('GET /api/feature error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function uploadImageToCloudinary(file) {
    try {
        let imageFile = file;
        // Handle blob URLs if needed (though we expect File objects from FormData)
        if (typeof file === 'string' && file.startsWith('blob:')) {
            const response = await fetch(file);
            imageFile = await response.blob();
        }

        const imageBuffer = await imageFile.arrayBuffer();
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
                    resolve(result.secure_url);
                }
            ).end(Buffer.from(new Uint8Array(imageBuffer)));
        });

        return uploadResult;
    } catch (error) {
        console.error('Image upload failed:', error);
        return null;
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.name) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const formData = await request.formData();

        // Debug: Log all form data keys
        console.log('Form data keys:', [...formData.keys()]);

        // Extract fields
        const title = formData.get('title');
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const shortDescription = formData.get('shortDescription');
        const mainImage = formData.get('mainImage');
        const contentBlocksRaw = formData.get('contentBlocks');
        const category = formData.get('category') || 'featured';
        const tags = formData.get('tags')?.split(',').map(t => t.trim()).filter(t => t) || [];
        const keyPoints = formData.get('keyPoints')?.split('\n').map(k => k.trim()).filter(k => k) || [];

        // Validate required fields
        if (!title || !metaTitle || !metaDescription || !shortDescription || !mainImage) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Debug: Log contentBlocks before parsing
        console.log('Raw contentBlocks:', contentBlocksRaw);

        // Parse content blocks
        let contentBlocks;
        try {
            contentBlocks = JSON.parse(contentBlocksRaw);
            if (!Array.isArray(contentBlocks)) {
                throw new Error('Content blocks must be an array');
            }
        } catch (error) {
            console.error('Content blocks parse error:', error);
            return NextResponse.json(
                { error: 'Invalid content blocks format' },
                { status: 400 }
            );
        }

        // Debug: Log parsed content blocks
        console.log('Parsed contentBlocks:', contentBlocks);

        // Upload main image
        const mainImageUrl = await uploadImageToCloudinary(mainImage);
        if (!mainImageUrl) {
            return NextResponse.json(
                { error: 'Failed to upload main image' },
                { status: 500 }
            );
        }

        // Process content blocks - upload images
        const processedBlocks = [];
        for (const [index, block] of contentBlocks.entries()) {
            if (block.type === 'image') {
                console.log(`Processing image block ${index}:`, block);

                // Get the image file from FormData using the imageKey
                const imageFile = formData.get(block.imageKey);
                if (!imageFile) {
                    console.error(`Image block ${index} missing image file`);
                    processedBlocks.push({
                        type: 'image',
                        imageUrl: '',
                        caption: block.caption || ''
                    });
                    continue;
                }

                try {
                    const imageUrl = await uploadImageToCloudinary(imageFile);
                    if (!imageUrl) {
                        throw new Error('Upload failed');
                    }

                    processedBlocks.push({
                        type: 'image',
                        imageUrl: imageUrl,
                        caption: block.caption || ''
                    });
                    console.log(`Successfully uploaded image block ${index}`);
                } catch (error) {
                    console.error(`Failed to upload image block ${index}:`, error);
                    processedBlocks.push({
                        type: 'image',
                        imageUrl: '',
                        caption: block.caption || ''
                    });
                }
            } else {
                processedBlocks.push(block);
            }
        }

        // Create slug
        const slug = slugify(title, { lower: true, strict: true });

        // Create story
        const story = new FeaturedStory({
            title,
            slug,
            metaTitle,
            metaDescription,
            shortDescription,
            mainImage: mainImageUrl,
            contentBlocks: processedBlocks,
            category,
            tags,
            keyPoints,
            author: session.user.name,
            status: 'published',
        });

        await story.save();

        return NextResponse.json(
            {
                message: 'Story created successfully',
                story: {
                    _id: story._id,
                    title: story.title,
                    slug: story.slug,
                    contentBlocks: story.contentBlocks,
                    mainImage: story.mainImage
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('POST /api/feature error:', error);
        return NextResponse.json(
            {
                error: error.message || 'Internal server error',
                details: error.errors
            },
            { status: 500 }
        );
    }
}