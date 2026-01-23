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



        const story = await FeaturedStory.findOne({
            slug: { $regex: new RegExp(`^${slug}$`, 'i') }
        }).lean();

        if (!story) {

            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        // Ensure contentBlocks is an array
        story.contentBlocks = Array.isArray(story.contentBlocks) ? story.contentBlocks : [];

        // Increment views
        await FeaturedStory.updateOne({ _id: story._id }, { $inc: { views: 1 } });


        return NextResponse.json(story, { status: 200 });
    } catch (error) {

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

                        return resolve(null);
                    }
                    resolve(result);
                }
            ).end(Buffer.from(new Uint8Array(imageBuffer)));
        });

        return uploadResult || null;
    } catch (error) {

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
            let alt = block.alt || existingBlocks[index]?.alt || '';

            if (imageFile && imageFile.size > 0) {

                const uploadResult = await uploadImageToCloudinary(imageFile);
                if (uploadResult) {
                    imageUrl = uploadResult.secure_url;
                    publicId = uploadResult.public_id;
                    width = uploadResult.width;
                    height = uploadResult.height;

                } else {

                    imageUrl = '';
                }
            }

            processedBlocks.push({
                type: 'image',
                imageUrl,
                caption: block.caption || '',
                alt: alt,
                publicId,
                dimensions: { width, height }
            });
        } else {
            processedBlocks.push({
                ...block,
                alt: block.alt || ''
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

        // Extract fields
        const title = formData.get('title');
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const shortDescription = formData.get('shortDescription');
        const mainImage = formData.get('mainImage');
        const mainImageAlt = formData.get('mainImageAlt') || '';
        const contentBlocksRaw = formData.get('contentBlocks');
        const category = formData.get('category') || 'featured';
        const tags = formData.get('tags')?.split(',').map(t => t.trim()).filter(t => t) || [];
        const keyPoints = formData.get('keyPoints')?.split('\n').map(k => k.trim()).filter(k => k) || [];
        const providedSlug = formData.get('slug');

        // Validate required fields
        if (!title || !metaTitle || !metaDescription || !shortDescription) {
            return NextResponse.json({
                error: 'Missing required fields: title, metaTitle, metaDescription, shortDescription'
            }, { status: 400 });
        }

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

            contentBlocks.forEach((block, index) => {
                if (block.type === 'image' && !block.alt?.trim()) {
                    throw new Error(`Image block ${index + 1} is missing ALT text`);
                }
            });
        } catch (error) {

            return NextResponse.json(
                { error: error.message || 'Invalid content blocks format' },
                { status: 400 }
            );
        }

        // Find the existing story
        const existingStory = await FeaturedStory.findOne({ slug });
        if (!existingStory) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        // Generate or validate slug
        let finalSlug = providedSlug ? slugify(providedSlug, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        }) : slugify(title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });

        // Ensure slug uniqueness (skip if it's the same as the current slug)
        if (finalSlug !== slug) {
            let counter = 1;
            let isUnique = false;

            while (!isUnique && counter <= 100) {
                const existingOtherStory = await FeaturedStory.findOne({ slug: finalSlug });
                if (!existingOtherStory || existingOtherStory._id.toString() === existingStory._id.toString()) {
                    isUnique = true;
                } else {
                    finalSlug = `${slugify(providedSlug || title, {
                        lower: true,
                        strict: true,
                        remove: /[*+~.()'"!:@]/g
                    })}-${counter}`;
                    counter++;
                }
            }

            if (!isUnique) {
                return NextResponse.json(
                    { error: 'Unable to generate a unique slug after multiple attempts. Please try a different title.' },
                    { status: 400 }
                );
            }
        }

        // Handle main image
        let mainImageUrl = existingStory.mainImage;
        let mainImageDimensions = existingStory.imageDimensions?.mainImage || { width: 800, height: 450 };

        if (mainImage && mainImage.size > 0) {

            const uploadResult = await uploadImageToCloudinary(mainImage);
            if (!uploadResult) {
                return NextResponse.json(
                    { error: 'Failed to upload main image' },
                    { status: 500 }
                );
            }
            mainImageUrl = uploadResult.secure_url;
            mainImageDimensions = { width: uploadResult.width, height: uploadResult.height };

        }

        // Process content blocks

        const processedBlocks = await optimizeContentBlockImages(contentBlocks, formData, existingStory.contentBlocks);

        // Update story
        existingStory.title = title.trim();
        existingStory.slug = finalSlug;
        existingStory.metaTitle = metaTitle.trim();
        existingStory.metaDescription = metaDescription.trim();
        existingStory.shortDescription = shortDescription.trim();
        existingStory.mainImage = mainImageUrl;
        existingStory.mainImageAlt = mainImageAlt.trim();
        existingStory.contentBlocks = processedBlocks;
        existingStory.category = category.toLowerCase().trim();
        existingStory.tags = tags;
        existingStory.keyPoints = keyPoints;
        existingStory.author = session.user.name;
        existingStory.imageDimensions = { mainImage: mainImageDimensions };

        await existingStory.save();

        return NextResponse.json(
            {
                message: 'Story updated successfully',
                story: {
                    _id: existingStory._id,
                    title: existingStory.title,
                    slug: existingStory.slug,
                    mainImage: existingStory.mainImage,
                    mainImageAlt: existingStory.mainImageAlt,
                    contentBlocks: existingStory.contentBlocks,
                    category: existingStory.category,
                    tags: existingStory.tags,
                    keyPoints: existingStory.keyPoints,
                    author: existingStory.author,
                    readingTime: existingStory.readingTime,
                    imageDimensions: existingStory.imageDimensions,
                    publishedDate: existingStory.publishedDate
                }
            },
            { status: 200 }
        );

    } catch (error) {


        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'A story with this slug already exists. Please choose a different title.' },
                { status: 400 }
            );
        }

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

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}