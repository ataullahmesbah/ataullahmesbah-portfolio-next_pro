import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: 'profile_images',
                    transformation: [{ width: 200, height: 200, crop: 'fill' }],
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(Buffer.from(buffer));
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
    }
}
