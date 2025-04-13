import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';

export async function POST(request) {
    try {
        const { image } = await request.json(); // Base64 image data
        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${image}`, {
            resource_type: 'image',
            format: 'webp',
            quality: 'auto:good',
        });

        return NextResponse.json({ url: uploadResult.secure_url }, { status: 200 });
    } catch (error) {
        console.error('POST /api/upload-image error:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}