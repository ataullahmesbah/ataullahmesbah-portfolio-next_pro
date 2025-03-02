import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';

export async function POST(req) {
    try {
        // Parse the form data
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert file to buffer
        const buffer = await file.arrayBuffer();

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'profile_images' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary error:', error);
                        reject(error);
                    } else {
                        console.log('Cloudinary result:', result);
                        resolve(result);
                    }
                }
            );
            stream.end(Buffer.from(buffer));
        });

        return NextResponse.json({ url: result.secure_url }, { status: 200 });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return NextResponse.json({ error: 'Something went wrong!' }, { status: 500 });
    }
}