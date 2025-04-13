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

        console.log(`Fetching story with slug: ${slug}`); // Debug log

        // Normalize slug to handle case sensitivity
        const story = await FeaturedStory.findOne({ slug: slug.toLowerCase() });
        if (!story) {
            console.log(`No story found for slug: ${slug}`);
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        story.views += 1;
        await story.save();

        return NextResponse.json(story, { status: 200 });
    } catch (error) {
        console.error('GET /api/feature/[slug] error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


async function uploadImageToCloudinary(file) {
    try {
        const imageBuffer = await file.arrayBuffer();
        const uploadResult = await new Promise((resolve) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'image', format: 'webp', quality: 'auto:good' },
                (error, result) => error ? resolve(null) : resolve(result)
            ).end(Buffer.from(new Uint8Array(imageBuffer)));
        });
        return uploadResult?.secure_url || null;
    } catch (error) {
        console.error('Image upload failed:', error);
        return null;
    }
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

        // Process content blocks
        const processedBlocks = [];
        for (const [index, block] of contentBlocks.entries()) {
            if (block.type === 'image') {
                const imageFile = formData.get(block.imageKey);
                let imageUrl = block.imageUrl || existingStory.contentBlocks[index]?.imageUrl || '';

                if (imageFile && imageFile.size > 0) {
                    imageUrl = await uploadImageToCloudinary(imageFile);
                    if (!imageUrl) {
                        console.error(`Failed to upload image for block ${index}`);
                        imageUrl = '';
                    }
                }

                processedBlocks.push({
                    type: 'image',
                    imageUrl,
                    caption: block.caption || ''
                });
            } else {
                processedBlocks.push(block);
            }
        }

        // Handle main image
        let mainImageUrl = existingStory.mainImage;
        if (mainImage && mainImage.size > 0) {
            mainImageUrl = await uploadImageToCloudinary(mainImage);
            if (!mainImageUrl) {
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

        // Update story
        const updatedStory = await FeaturedStory.findOneAndUpdate(
            { slug },
            {
                title,
                slug: newSlug,
                metaTitle,
                metaDescription,
                shortDescription,
                mainImage: mainImageUrl,
                contentBlocks: processedBlocks,
                category,
                tags,
                keyPoints,
                author: session.user.name,
            },
            { new: true }
        );

        return NextResponse.json(
            {
                message: 'Story updated successfully',
                story: updatedStory
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('PUT /api/feature/[slug] error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
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