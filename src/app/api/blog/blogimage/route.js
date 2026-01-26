// app/api/blog/blogimage/route.js


import cloudinary from '@/utils/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: 'blog_images' }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                })
                .end(buffer);
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (error) {
      
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}