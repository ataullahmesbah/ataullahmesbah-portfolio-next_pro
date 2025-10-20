// app/api/admin/ads/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ads from '@/models/Ads';
import cloudinary from '@/utils/cloudinary';

export async function PUT(req, { params }) {
    await dbConnect();
    const { id } = params;

    try {
        const contentType = req.headers.get('content-type') || '';

        let updateData = {};
        let imageUrl = null;

        if (contentType.includes('multipart/form-data')) {
            // Handle FormData from admin (create/edit with image)
            const formData = await req.formData();

            // Get all fields
            updateData.title = formData.get('title');
            updateData.buttonText = formData.get('buttonText');
            updateData.buttonLink = formData.get('buttonLink');
            updateData.displayLimit = parseInt(formData.get('displayLimit')) || 3;
            updateData.displayTime = parseInt(formData.get('displayTime')) || 10;
            updateData.startDate = new Date(formData.get('startDate'));
            updateData.endDate = new Date(formData.get('endDate'));
            updateData.isActive = formData.get('isActive') === 'true';
            updateData.targetPages = formData.getAll('targetPages'); // Get all pages as array

            // Handle image
            const image = formData.get('image');
            if (image) {
                // Upload new image to Cloudinary (adapt from your POST API)
                const imageBuffer = Buffer.from(await image.arrayBuffer());
                imageUrl = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            format: 'webp',
                            folder: 'ads',
                            transformation: [{ width: 300, height: 500, crop: 'fill' }]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    );
                    uploadStream.end(imageBuffer);
                });
            } else {
                // Use existing if provided
                imageUrl = formData.get('imageUrl');
            }

            if (imageUrl) updateData.imageUrl = imageUrl;

        } else {
            // Handle JSON for increments or toggles (e.g., clicks, isActive)
            const body = await req.json();
            const { $inc, ...otherData } = body;
            updateData = { ...otherData };
            if ($inc) updateData.$inc = $inc;
        }

        // Validate required fields for admin updates
        if (!updateData.title || !updateData.buttonLink || !updateData.startDate || !updateData.endDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const ad = await Ads.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!ad) {
            return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
        }

        console.log('Ad updated successfully:', ad._id);
        return NextResponse.json({ success: true, data: ad });

    } catch (error) {
        console.error('PUT Error:', error);
        return NextResponse.json({ error: 'Failed to update ad: ' + error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    // Unchanged - your code is fine
    await dbConnect();
    try {
        const { id } = params;
        const ad = await Ads.findByIdAndDelete(id);
        if (!ad) return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Ad deleted' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req, { params }) {
    // Unchanged - your code is fine
    await dbConnect();
    try {
        const { id } = params;
        const ad = await Ads.findById(id);
        if (!ad) return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: ad });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

