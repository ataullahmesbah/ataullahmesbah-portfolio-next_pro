// api/feature/route.js

import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';
import FeaturedStory from '@/models/FeaturedStory';
import { getServerSession } from 'next-auth';
import slugify from 'slugify';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbMongoose';


function calculateReadingTime(contentBlocks) {
    if (!Array.isArray(contentBlocks)) return 5;

    let totalWords = 0;

    contentBlocks.forEach(block => {
        if (['paragraph', 'heading'].includes(block.type) && block.content) {
            const words = block.content.split(/\s+/).length;
            totalWords += words;
        }
    });

    // Average reading speed: 200 words per minute
    const readingTime = Math.ceil(totalWords / 200);
    return readingTime > 0 ? readingTime : 1; // Minimum 1 minute
}


export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const excludeId = searchParams.get('excludeId');
        const limit = parseInt(searchParams.get('limit')) || 10;
        const page = parseInt(searchParams.get('page')) || 1;
        const skip = (page - 1) * limit;

        const query = { status: 'published' };
        if (category) query.category = category;
        if (excludeId) query._id = { $ne: excludeId };

        // Get total count for pagination
        const total = await FeaturedStory.countDocuments(query);

        // Fetch stories with sorting by latest first (descending order)
        const stories = await FeaturedStory.find(query)
            .sort({ createdAt: -1 }) // Latest stories first (newest to oldest)
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();

        // Ensure contentBlocks is an array and calculate reading time
        const sanitizedStories = stories.map(story => ({
            ...story,
            contentBlocks: Array.isArray(story.contentBlocks) ? story.contentBlocks : [],
            readingTime: calculateReadingTime(story.contentBlocks),
            views: story.views || 0,
            category: story.category || 'featured',
            tags: story.tags || [],
            keyPoints: story.keyPoints || [],
            author: story.author || 'Ataullah Mesbah',
            // Ensure dates are properly formatted
            createdAt: story.createdAt || new Date(),
            publishedDate: story.publishedDate || story.createdAt || new Date(),
        }));

        return NextResponse.json({
            stories: sanitizedStories,
            total,
            page,
            pages: Math.ceil(total / limit)
        }, { status: 200 });
    } catch (error) {
        console.error('GET /api/feature error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


// Enhanced upload function with better error handling
async function uploadImageToCloudinary(file, options = {}) {
    try {
        const imageBuffer = await file.arrayBuffer();

        const uploadOptions = {
            resource_type: 'image',
            format: 'webp',
            quality: 'auto:good',
            transformation: [
                {
                    width: 800,
                    height: 450,
                    crop: 'fill',
                    gravity: 'auto',
                    quality: 'auto:good',
                    format: 'webp'
                }
            ],
            ...options
        };

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return reject(error);
                    }
                    resolve(result);
                }
            ).end(Buffer.from(new Uint8Array(imageBuffer)));
        });

        return uploadResult;
    } catch (error) {
        console.error('Image upload failed:', error);
        throw new Error('Image upload failed');
    }
}

// Enhanced content block optimization with ALT text support
async function optimizeContentBlockImages(contentBlocks, formData) {
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
                    caption: block.caption || '',
                    alt: block.alt || '' // Preserve ALT text
                });
                continue;
            }

            try {
                const uploadResult = await uploadImageToCloudinary(imageFile);
                if (!uploadResult) {
                    throw new Error('Upload failed');
                }

                processedBlocks.push({
                    type: 'image',
                    imageUrl: uploadResult.secure_url,
                    caption: block.caption || '',
                    alt: block.alt || '', // Include ALT text
                    publicId: uploadResult.public_id,
                    width: uploadResult.width,
                    height: uploadResult.height
                });
                console.log(`Successfully uploaded image block ${index}:`, {
                    url: uploadResult.secure_url,
                    dimensions: `${uploadResult.width}x${uploadResult.height}`,
                    alt: block.alt || ''
                });
            } catch (error) {
                console.error(`Failed to upload image block ${index}:`, error);
                processedBlocks.push({
                    type: 'image',
                    imageUrl: '',
                    caption: block.caption || '',
                    alt: block.alt || '' // Preserve ALT text even if upload fails
                });
            }
        } else {
            // For non-image blocks, include ALT text if provided
            processedBlocks.push({
                ...block,
                alt: block.alt || '' // Ensure alt field exists
            });
        }
    }

    return processedBlocks;
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

        // Extract fields - ALT text সহ
        const title = formData.get('title');
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const shortDescription = formData.get('shortDescription');
        const mainImage = formData.get('mainImage');
        const mainImageAlt = formData.get('mainImageAlt') || ''; // Main image ALT text
        const contentBlocksRaw = formData.get('contentBlocks');
        const category = formData.get('category') || 'featured';
        const tags = formData.get('tags')?.split(',').map(t => t.trim()).filter(t => t) || [];
        const keyPoints = formData.get('keyPoints')?.split('\n').map(k => k.trim()).filter(k => k) || [];

        // Validate required fields
        if (!title || !metaTitle || !metaDescription || !shortDescription || !mainImage) {
            return NextResponse.json({
                error: 'Missing required fields: title, metaTitle, metaDescription, shortDescription, mainImage'
            }, { status: 400 });
        }

        // Validate main image ALT text
        if (!mainImageAlt.trim()) {
            return NextResponse.json({
                error: 'Main image ALT text is required for accessibility'
            }, { status: 400 });
        }

        // Parse content blocks
        let contentBlocks;
        try {
            contentBlocks = JSON.parse(contentBlocksRaw);
            if (!Array.isArray(contentBlocks)) {
                throw new Error('Content blocks must be an array');
            }

            // Validate content blocks have required fields
            const invalidBlocks = contentBlocks.filter((block, index) => {
                if (block.type === 'image' && !block.alt?.trim()) {
                    throw new Error(`Image block ${index + 1} is missing ALT text`);
                }
                return false;
            });

        } catch (error) {
            console.error('Content blocks parse error:', error);
            return NextResponse.json(
                { error: error.message || 'Invalid content blocks format' },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const baseSlug = slugify(title, { lower: true, strict: true });
        const existingSlug = await FeaturedStory.findOne({
            slug: new RegExp(`^${baseSlug}`, 'i')
        });

        if (existingSlug) {
            return NextResponse.json(
                { error: 'A story with similar title already exists' },
                { status: 400 }
            );
        }

        // Upload main image with 800x450px size
        console.log('Uploading main image...');
        const mainImageUpload = await uploadImageToCloudinary(mainImage);

        if (!mainImageUpload) {
            return NextResponse.json(
                { error: 'Failed to upload main image' },
                { status: 500 }
            );
        }

        console.log('Main image uploaded:', {
            url: mainImageUpload.secure_url,
            dimensions: `${mainImageUpload.width}x${mainImageUpload.height}`
        });

        // Process content blocks - upload images with optimization
        console.log('Processing content block images...');
        const processedBlocks = await optimizeContentBlockImages(contentBlocks, formData);

        // Generate unique slug with timestamp
        const slug = `${baseSlug}-${Date.now()}`;

        // Create story with all fields including ALT text
        const story = new FeaturedStory({
            title: title.trim(),
            slug,
            metaTitle: metaTitle.trim(),
            metaDescription: metaDescription.trim(),
            shortDescription: shortDescription.trim(),
            mainImage: mainImageUpload.secure_url,
            mainImageAlt: mainImageAlt.trim(), // Include main image ALT
            contentBlocks: processedBlocks,
            category: category.toLowerCase().trim(), // Normalize category
            tags: tags,
            keyPoints: keyPoints,
            author: session.user.name,
            status: 'published',
            imageDimensions: {
                mainImage: {
                    width: mainImageUpload.width,
                    height: mainImageUpload.height
                }
            },
            // readingTime will be auto-calculated by pre-save hook
        });

        await story.save();

        return NextResponse.json(
            {
                message: 'Story created successfully',
                story: {
                    _id: story._id,
                    title: story.title,
                    slug: story.slug,
                    mainImage: story.mainImage,
                    mainImageAlt: story.mainImageAlt,
                    contentBlocks: story.contentBlocks,
                    category: story.category,
                    tags: story.tags,
                    keyPoints: story.keyPoints,
                    author: story.author,
                    readingTime: story.readingTime,
                    imageDimensions: story.imageDimensions,
                    publishedDate: story.publishedDate
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('POST /api/feature error:', error);

        // Handle duplicate key error (unique slug)
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'A story with this title already exists' },
                { status: 400 }
            );
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                { error: 'Validation failed', details: errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: error.message || 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

