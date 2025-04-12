import dbConnect from '@/lib/dbMongoose';
import FeaturedStory from '@/models/FeaturedStory';
import cloudinary from '@/utils/cloudinary';
import { NextResponse } from 'next/server';


export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { slug } = params;
        const story = await FeaturedStory.findOne({ slug }).populate('author', 'name email');

        if (!story) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        // Increment views
        story.views += 1;
        await story.save();

        return NextResponse.json(story);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { slug } = params;
        const formData = await request.formData();

        const updateData = {
            title: formData.get('title'),
            metaDescription: formData.get('metaDescription'),
            description: formData.get('description'),
            content: JSON.parse(formData.get('content')),
            category: formData.get('category'),
            tags: formData.get('tags').split(',').map(t => t.trim()),
            metaTitle: formData.get('metaTitle'),
            author: formData.get('author'),
            keyPoints: formData.get('keyPoints').split(',').map(k => k.trim())
        };

        const image = formData.get('image');
        if (image && image.size > 0) {
            const uploadResponse = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image', format: 'webp' },
                    (error, result) => error ? reject(error) : resolve(result)
                );
                image.stream().pipe(stream);
            });
            updateData.image = uploadResponse.secure_url;
        }

        const updatedStory = await FeaturedStory.findOneAndUpdate(
            { slug },
            updateData,
            { new: true }
        ).populate('author', 'name email');

        if (!updatedStory) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        return NextResponse.json({ story: updatedStory });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { slug } = params;
        const deletedStory = await FeaturedStory.findOneAndDelete({ slug });

        if (!deletedStory) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Story deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
    }
}