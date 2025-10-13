// api/feature/[slug]/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import slugify from 'slugify';
import dbConnect from '@/lib/dbMongoose';
import FeaturedStory from '@/models/FeaturedStory';
import { authOptions } from '../../auth/[...nextauth]/route';
import cloudinary from '@/utils/cloudinary';



export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { slug } = params;

        console.log('Fetching story with slug:', slug);

        const story = await FeaturedStory.findOne({
            slug: { $regex: new RegExp(`^${slug}$`, 'i') }
        }).lean();

        if (!story) {
            console.log('Story not found for slug:', slug);
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        // Ensure contentBlocks is an array
        story.contentBlocks = Array.isArray(story.contentBlocks) ? story.contentBlocks : [];

        // Increment views
        await FeaturedStory.updateOne({ _id: story._id }, { $inc: { views: 1 } });

        console.log('Story found:', story.title);
        return NextResponse.json(story, { status: 200 });
    } catch (error) {
        console.error('GET /api/featured-story/[slug] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


// Enhanced upload function with 800x450px resize
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

        const uploadResult = await new Promise((resolve) => {
            cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return resolve(null);
                    }
                    resolve(result);
                }
            ).end(Buffer.from(new Uint8Array(imageBuffer)));
        });

        return uploadResult || null;
    } catch (error) {
        console.error('Image upload failed:', error);
        return null;
    }
}

// Enhanced function with ALT text support
async function optimizeContentBlockImages(contentBlocks, formData, existingBlocks = []) {
    const processedBlocks = [];

    for (const [index, block] of contentBlocks.entries()) {
        if (block.type === 'image') {
            const imageFile = formData.get(block.imageKey);
            let imageUrl = block.imageUrl || existingBlocks[index]?.imageUrl || '';
            let publicId = null;
            let width = 800;
            let height = 450;
            let alt = block.alt || existingBlocks[index]?.alt || ''; // ALT text preserve

            // Upload new image if provided
            if (imageFile && imageFile.size > 0) {
                console.log(`Uploading new image for block ${index}`);
                const uploadResult = await uploadImageToCloudinary(imageFile);
                if (uploadResult) {
                    imageUrl = uploadResult.secure_url;
                    publicId = uploadResult.public_id;
                    width = uploadResult.width;
                    height = uploadResult.height;
                    console.log(`Image uploaded successfully: ${width}x${height}`);
                } else {
                    console.error(`Failed to upload image for block ${index}`);
                    imageUrl = '';
                }
            }

            processedBlocks.push({
                type: 'image',
                imageUrl,
                caption: block.caption || '',
                alt: alt, // ALT text include
                publicId,
                dimensions: { width, height }
            });
        } else {
            // For non-image blocks, preserve ALT text if exists
            processedBlocks.push({
                ...block,
                alt: block.alt || '' // Ensure alt field exists for all blocks
            });
        }
    }

    return processedBlocks;
}

export async function PUT(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.name) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { slug } = params;
        const formData = await request.formData();

        const existingStory = await FeaturedStory.findOne({ slug });
        if (!existingStory) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        // Extract fields - ALT text সহ
        const title = formData.get('title');
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const shortDescription = formData.get('shortDescription');
        const mainImage = formData.get('mainImage');
        const mainImageAlt = formData.get('mainImageAlt') || ''; // ALT text add করুন
        const contentBlocksRaw = formData.get('contentBlocks');
        const category = formData.get('category') || 'featured';
        const tags = formData.get('tags')?.split(',').map(t => t.trim()).filter(t => t) || [];
        const keyPoints = formData.get('keyPoints')?.split('\n').map(k => k.trim()).filter(k => k) || [];

        // Validate required fields
        if (!title || !metaTitle || !metaDescription || !shortDescription) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

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

        // Process content blocks with image optimization এবং ALT text
        console.log('Processing content blocks with image optimization...');
        const processedBlocks = await optimizeContentBlockImages(
            contentBlocks,
            formData,
            existingStory.contentBlocks
        );

        // Handle main image with 800x450px optimization
        let mainImageUrl = existingStory.mainImage;
        let mainImagePublicId = existingStory.imageDimensions?.mainImage?.publicId;
        let mainImageDimensions = existingStory.imageDimensions?.mainImage || { width: 800, height: 450 };

        if (mainImage && mainImage.size > 0) {
            console.log('Uploading new main image with 800x450px optimization...');
            const mainImageUpload = await uploadImageToCloudinary(mainImage);
            if (mainImageUpload) {
                mainImageUrl = mainImageUpload.secure_url;
                mainImagePublicId = mainImageUpload.public_id;
                mainImageDimensions = {
                    width: mainImageUpload.width,
                    height: mainImageUpload.height
                };
                console.log(`Main image uploaded: ${mainImageUpload.width}x${mainImageUpload.height}`);
            } else {
                return NextResponse.json(
                    { error: 'Failed to upload main image' },
                    { status: 500 }
                );
            }
        }

        // Generate new slug if title changed
        const newSlug = title !== existingStory.title
            ? slugify(title, { lower: true, strict: true })
            : slug;

        // Check if slug already exists (different story)
        if (newSlug !== slug) {
            const existingSlug = await FeaturedStory.findOne({ slug: newSlug, _id: { $ne: existingStory._id } });
            if (existingSlug) {
                return NextResponse.json(
                    { error: 'A story with this title already exists' },
                    { status: 400 }
                );
            }
        }

        // Prepare update data - ALT text সহ
        const updateData = {
            title,
            slug: newSlug,
            metaTitle,
            metaDescription,
            shortDescription,
            mainImage: mainImageUrl,
            mainImageAlt: mainImageAlt || existingStory.mainImageAlt, // Existing ALT রাখুন যদি নতুন না থাকে
            contentBlocks: processedBlocks,
            category,
            tags,
            keyPoints,
            author: session.user.name,
            imageDimensions: {
                mainImage: mainImageDimensions,
                publicId: mainImagePublicId
            },
            updatedAt: new Date()
        };

        // Update story
        const updatedStory = await FeaturedStory.findOneAndUpdate(
            { slug },
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        return NextResponse.json(
            {
                message: 'Story updated successfully',
                story: {
                    _id: updatedStory._id,
                    title: updatedStory.title,
                    slug: updatedStory.slug,
                    mainImage: updatedStory.mainImage,
                    mainImageAlt: updatedStory.mainImageAlt,
                    contentBlocks: updatedStory.contentBlocks,
                    imageDimensions: updatedStory.imageDimensions,
                    category: updatedStory.category,
                    tags: updatedStory.tags,
                    keyPoints: updatedStory.keyPoints,
                    author: updatedStory.author,
                    updatedAt: updatedStory.updatedAt
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('PUT /api/feature/[slug] error:', error);
        return NextResponse.json(
            {
                error: error.message || 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { slug } = params;

        const deletedStory = await FeaturedStory.findOneAndDelete({ slug });
        if (!deletedStory) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        return NextResponse.json(
            { message: 'Story deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('DELETE /api/feature/[slug] error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}