// app/api/admin/ads/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ad from '@/models/Ad';
import cloudinary from '@/utils/cloudinary';

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  
  try {
    const formData = await req.formData();
    
    let updateData = {
      buttonText: formData.get('buttonText')?.toString()?.trim(),
      buttonLink: formData.get('buttonLink')?.toString()?.trim(),
      viewLimitPerUser: parseInt(formData.get('viewLimitPerUser')) || 5,
      pages: formData.getAll('pages').filter(p => p) || ['*'],
      displaySeconds: parseInt(formData.get('displaySeconds')) || 10,
      priority: parseInt(formData.get('priority')) || 1,
      isActive: formData.get('isActive') === 'true'
    };

    // Handle dates
    const startDateValue = formData.get('startDate');
    const endDateValue = formData.get('endDate');
    updateData.startDate = startDateValue ? new Date(startDateValue) : null;
    updateData.endDate = endDateValue ? new Date(endDateValue) : null;

    // Validate required fields
    if (!updateData.buttonText || !updateData.buttonLink) {
      return NextResponse.json(
        { error: 'Button text and link are required' }, 
        { status: 400 }
      );
    }

    const image = formData.get('image');
    if (image && image.size > 0) {
      try {
        const imageBuffer = Buffer.from(await image.arrayBuffer());
        updateData.imageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: 'ads',
              transformation: [
                { width: 300, height: 500, crop: 'fill' },
                { quality: 'auto', format: 'webp' }
              ]
            },
            (error, result) => {
              if (error) reject(new Error('Image upload failed'));
              else resolve(result.secure_url);
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
    }

    const ad = await Ad.findByIdAndUpdate(id, updateData, { 
      new: true,
      runValidators: true 
    });
    
    if (!ad) {
      return NextResponse.json(
        { error: 'Ad not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Ad updated successfully',
      data: ad
    });
    
  } catch (error) {
    console.error('Production Error updating ad:', error);
    
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

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;
  
  try {
    const ad = await Ad.findByIdAndDelete(id);
    
    if (!ad) {
      return NextResponse.json(
        { error: 'Ad not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Ad deleted successfully' 
    });
    
  } catch (error) {
    console.error('Production Error deleting ad:', error);
    return NextResponse.json(
      { error: 'Failed to delete ad' }, 
      { status: 500 }
    );
  }
}