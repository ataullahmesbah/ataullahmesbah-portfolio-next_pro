// app/api/admin/ads/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ad from '@/models/Ad';
import cloudinary from '@/utils/cloudinary';

export async function POST(req) {
    await dbConnect();

    try {
        const formData = await req.formData();

        // Required fields validation
        const buttonText = formData.get('buttonText')?.toString()?.trim();
        const buttonLink = formData.get('buttonLink')?.toString()?.trim();
        const image = formData.get('image');

        if (!buttonText || !buttonLink) {
            return NextResponse.json(
                { error: 'Button text and link are required' },
                { status: 400 }
            );
        }

        if (!image || image.size === 0) {
            return NextResponse.json(
                { error: 'Image is required' },
                { status: 400 }
            );
        }

        // Process other fields
        const viewLimitPerUser = parseInt(formData.get('viewLimitPerUser')) || 5;
        const pages = formData.getAll('pages').filter(p => p) || ['*'];
        const displaySeconds = parseInt(formData.get('displaySeconds')) || 10;
        const priority = parseInt(formData.get('priority')) || 1;

        // Handle dates
        const startDateValue = formData.get('startDate');
        const endDateValue = formData.get('endDate');
        const startDate = startDateValue ? new Date(startDateValue) : null;
        const endDate = endDateValue ? new Date(endDateValue) : null;

        const isActive = formData.get('isActive') === 'true';

        // Upload image to Cloudinary
        let imageUrl = '';
        try {
            const imageBuffer = Buffer.from(await image.arrayBuffer());

            imageUrl = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'ads',
                        transformation: [
                            { width: 300, height: 500, crop: 'fill' },
                            { quality: 'auto', format: 'webp' }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            reject(new Error('Failed to upload image'));
                        } else {
                            resolve(result.secure_url);
                        }
                    }
                );
                uploadStream.end(imageBuffer);
            });
        } catch (uploadError) {
            return NextResponse.json(
                { error: 'Image upload failed' },
                { status: 500 }
            );
        }

        // Create ad
        const ad = new Ad({
            imageUrl,
            buttonText,
            buttonLink,
            viewLimitPerUser,
            pages,
            displaySeconds,
            priority,
            startDate,
            endDate,
            isActive
        });

        await ad.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Ad created successfully',
                data: ad
            },
            { status: 201 }
        );

    } catch (error) {
       

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                { error: errors.join(', ') },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    await dbConnect();

    try {
        const ads = await Ad.find().sort({ priority: -1, createdAt: -1 });
        return NextResponse.json(ads);
    } catch (error) {
      
        return NextResponse.json(
            { error: 'Failed to fetch ads' },
            { status: 500 }
        );
    }
}