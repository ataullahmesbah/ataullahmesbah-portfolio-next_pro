// app/api/admin/ads/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ads from '@/models/Ads';
import cloudinary from '@/utils/cloudinary';

export async function POST(req) {
    await dbConnect();

    try {
        console.log('Starting ad creation...');

        const formData = await req.formData();

        // Get all form data
        const title = formData.get('title');
        const buttonText = formData.get('buttonText') || 'Get Started';
        const buttonLink = formData.get('buttonLink');
        const targetPages = formData.getAll('targetPages');
        const displayLimit = parseInt(formData.get('displayLimit')) || 3;
        const displayTime = parseInt(formData.get('displayTime')) || 10;
        const startDate = formData.get('startDate');
        const endDate = formData.get('endDate');
        const isActive = formData.get('isActive') === 'true';
        const image = formData.get('image');

        console.log('Form data received:', {
            title, buttonText, buttonLink, targetPages, displayLimit, displayTime,
            startDate, endDate, isActive, image: image ? 'Yes' : 'No'
        });

        // Validate required fields
        if (!title || !buttonLink || !startDate || !endDate || !image) {
            return NextResponse.json(
                { error: 'Missing required fields: title, buttonLink, startDate, endDate, image' },
                { status: 400 }
            );
        }

        // Upload image to Cloudinary
        console.log('Uploading image to Cloudinary...');
        const imageBuffer = Buffer.from(await image.arrayBuffer());

        const imageUrl = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    format: 'webp',
                    folder: 'ads',
                    transformation: [
                        { width: 300, height: 500, crop: 'fill' },
                        { quality: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Cloudinary upload success:', result.secure_url);
                        resolve(result.secure_url);
                    }
                }
            );
            uploadStream.end(imageBuffer);
        });

        console.log('Creating ad in database...');

        // Use any target pages without enum validation
        const ads = new Ads({
            title,
            imageUrl,
            buttonText,
            buttonLink,
            targetPages: targetPages.length > 0 ? targetPages : ['*'],
            displayLimit,
            displayTime,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isActive
        });

        await ads.save();
        console.log('Ad created successfully:', ads._id);

        return NextResponse.json({
            success: true,
            data: ads,
            message: 'Ad created successfully'
        }, { status: 201 });

    } catch (error) {
        console.error('API Error details:', error);
        return NextResponse.json({
            error: 'Failed to create ad: ' + error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

export async function GET() {
    await dbConnect();

    try {
        console.log('Fetching ads from database...');
        const ads = await Ads.find().sort({ createdAt: -1 });
        console.log(`Found ${ads.length} ads`);

        return NextResponse.json({
            success: true,
            data: ads,
            count: ads.length
        });
    } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({
            error: error.message,
            success: false
        }, { status: 500 });
    }
}