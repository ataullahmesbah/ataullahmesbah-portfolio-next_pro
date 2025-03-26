// src/app/api/newsletter/letter/route.js

import dbConnect from '@/lib/dbMongoose';
import Newsletter from '@/models/newsletter';
import slugify from 'slugify';

export async function GET(req) {
    await dbConnect();
    try {
        const newsletters = await Newsletter.find().sort({ publishDate: -1 });
        return new Response(JSON.stringify(newsletters), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch newsletters' }), { status: 500 });
    }
}

export async function POST(req) {
    await dbConnect();
    try {
        const body = await req.json();
        const { title, mainImage, metaTitle, metaDescription, description, content, category, author } = body;

        if (!title || !mainImage || !metaTitle || !metaDescription || !description || !content || !category || !author) {
            return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
        }

        const slug = slugify(title, { lower: true, strict: true });
        const existingNewsletter = await Newsletter.findOne({ slug });
        if (existingNewsletter) {
            return new Response(JSON.stringify({ error: 'Newsletter with this title already exists' }), { status: 400 });
        }

        const newsletter = new Newsletter({
            mainImage,
            title,
            metaTitle,
            metaDescription,
            description,
            content,
            category,
            views: 0,
            slug,
            author,
            publishDate: new Date(),
        });

        await newsletter.save();
        return new Response(JSON.stringify({ message: 'Newsletter created successfully' }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create newsletter' }), { status: 500 });
    }
}

export async function PUT(req) {
    await dbConnect();
    try {
        const body = await req.json();
        const { id, title, mainImage, metaTitle, metaDescription, description, content, category, author } = body;

        if (!id) {
            return new Response(JSON.stringify({ error: 'Newsletter ID is required' }), { status: 400 });
        }

        const slug = slugify(title, { lower: true, strict: true });
        const updatedNewsletter = await Newsletter.findByIdAndUpdate(
            id,
            {
                mainImage,
                title,
                metaTitle,
                metaDescription,
                description,
                content,
                category,
                slug,
                author,
            },
            { new: true }
        );

        if (!updatedNewsletter) {
            return new Response(JSON.stringify({ error: 'Newsletter not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'Newsletter updated successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update newsletter' }), { status: 500 });
    }
}

export async function DELETE(req) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return new Response(JSON.stringify({ error: 'Newsletter ID is required' }), { status: 400 });
        }

        const deletedNewsletter = await Newsletter.findByIdAndDelete(id);
        if (!deletedNewsletter) {
            return new Response(JSON.stringify({ error: 'Newsletter not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'Newsletter deleted successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete newsletter' }), { status: 500 });
    }
}