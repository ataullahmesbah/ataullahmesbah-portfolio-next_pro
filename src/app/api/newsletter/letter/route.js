// src/app/api/newsletter/letter/route.js

import dbConnect from '@/lib/dbMongoose';
import Newsletter from '@/models/newsletter';
import cloudinary from '@/utils/cloudinary';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const slug = searchParams.get('slug');

        if (id) {
            const newsletter = await Newsletter.findById(id);
            if (!newsletter) {
                return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 });
            }
            return NextResponse.json(newsletter, { status: 200 });
        } else if (slug) {
            const newsletter = await Newsletter.findOne({ slug });
            if (!newsletter) {
                return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 });
            }
            // Increment views
            newsletter.views = (newsletter.views || 0) + 1;
            await newsletter.save();
            return NextResponse.json(newsletter, { status: 200 });
        } else {
            const newsletters = await Newsletter.find().sort({ publishDate: -1 });
            return NextResponse.json(newsletters, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch newsletters' }, { status: 500 });
    }
}



export async function POST(req) {
    await dbConnect();
    try {
        const formData = await req.formData();
        const title = formData.get('title');
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const description = formData.get('description');
        const contentSections = JSON.parse(formData.get('contentSections'));
        const category = formData.get('category');
        const imageAlt = formData.get('imageAlt');
        const mainImageFile = formData.get('mainImage');
        const author = formData.get('author');

        // Validate required fields
        if (!title || !metaTitle || !metaDescription || !description || !category || !imageAlt || !mainImageFile || !author) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Upload main image to Cloudinary
        let mainImageUrl = '';
        const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer());
        mainImageUrl = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'newsletters/main',
                    fetch_format: 'webp',
                    quality: 'auto',
                    flags: 'lossy',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                }
            ).end(mainImageBuffer);
        });

        const newsletterData = {
            title,
            metaTitle,
            metaDescription: metaDescription.slice(0, 160),
            description,
            content: contentSections,
            category,
            mainImage: mainImageUrl,
            imageAlt,
            author,
        };

        const newsletter = new Newsletter(newsletterData);
        await newsletter.save();
        return NextResponse.json({ message: 'Newsletter created successfully', newsletter }, { status: 201 });
    } catch (error) {
        console.error('Error creating newsletter:', error);
        return NextResponse.json({ error: 'Failed to create newsletter', message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    await dbConnect();
    try {
        const formData = await req.formData();
        const id = formData.get('id');
        const title = formData.get('title');
        const metaTitle = formData.get('metaTitle');
        const metaDescription = formData.get('metaDescription');
        const description = formData.get('description');
        const contentSections = JSON.parse(formData.get('contentSections'));
        const category = formData.get('category');
        const imageAlt = formData.get('imageAlt');
        const mainImageFile = formData.get('mainImage');
        const author = formData.get('author');

        const newsletter = await Newsletter.findById(id);
        if (!newsletter) {
            return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 });
        }

        // Update fields
        newsletter.title = title || newsletter.title;
        newsletter.metaTitle = metaTitle || newsletter.metaTitle;
        newsletter.metaDescription = metaDescription ? metaDescription.slice(0, 160) : newsletter.metaDescription;
        newsletter.description = description || newsletter.description;
        newsletter.category = category || newsletter.category;
        newsletter.imageAlt = imageAlt || newsletter.imageAlt;
        newsletter.author = author || newsletter.author;

        // Update content sections
        if (contentSections) {
            newsletter.content = contentSections;
        }

        // Update main image if provided
        if (mainImageFile && mainImageFile.size > 0) {
            const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer());
            const mainImageUrl = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'newsletters/main',
                        fetch_format: 'webp',
                        quality: 'auto',
                        flags: 'lossy',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                ).end(mainImageBuffer);
            });
            newsletter.mainImage = mainImageUrl;
        }

        await newsletter.save();
        return NextResponse.json({ message: 'Newsletter updated successfully', newsletter }, { status: 200 });
    } catch (error) {
        console.error('Error updating newsletter:', error);
        return NextResponse.json({ error: 'Failed to update newsletter', message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Newsletter ID is required' }, { status: 400 });
        }

        const deletedNewsletter = await Newsletter.findByIdAndDelete(id);
        if (!deletedNewsletter) {
            return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Newsletter deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete newsletter' }, { status: 500 });
    }
}