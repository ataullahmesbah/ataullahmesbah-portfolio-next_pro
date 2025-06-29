

import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';
import ShopBanner from '@/models/ShopBanner';
import dbConnect from '@/lib/dbMongoose';



export async function GET() {
  try {
    await dbConnect();
    const banners = await ShopBanner.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: banners }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'subtitle', 'highlights', 'cta', 'bg', 'textColor', 'badgeColor', 'features', 'image', 'link'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate image URL and ensure WebP format
    if (data.image) {
      try {
        const publicId = data.image.split('/').pop().split('.')[0];
        const webpUrl = cloudinary.url(publicId, {
          fetch_format: 'webp',
          quality: 'auto',
          width: 1920,
          height: 1080,
          crop: 'fill',
        });
        data.image = webpUrl;
      } catch (err) {
        console.error('Error transforming image URL:', err);
      }
    }

    const banner = await ShopBanner.create(data);
    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Banner ID is required' }, { status: 400 });
    }

    // Validate image URL and ensure WebP format
    if (updateData.image) {
      try {
        const publicId = updateData.image.split('/').pop().split('.')[0];
        const webpUrl = cloudinary.url(publicId, {
          fetch_format: 'webp',
          quality: 'auto',
          width: 1920,
          height: 1080,
          crop: 'fill',
        });
        updateData.image = webpUrl;
      } catch (err) {
        console.error('Error transforming image URL:', err);
      }
    }

    const banner = await ShopBanner.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!banner) {
      return NextResponse.json({ success: false, error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: banner }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}