
// src/api/profile/upload/route.js

import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import cloudinary from '@/utils/cloudinary';
import { NextResponse } from 'next/server';


export async function POST(req) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Parse the FormData
    const formData = await req.formData();
    const file = formData.get('image');
    const userId = formData.get('userId');

    // Validate the input
    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and userId are required' },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // Upload the file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(fileBuffer);
    });

    // Update the user profile in MongoDB
    let userProfile = await UserProfile.findOne({ userId });
    if (userProfile) {
      userProfile.verificationImage = result.secure_url;
      userProfile.verification = 'pending'; // Ensure this line is present
    } else {
      userProfile = new UserProfile({
        userId,
        verificationImage: result.secure_url,
        verification: 'pending', // Ensure this line is present
      });
    }
    await userProfile.save();

    // Return the updated profile
    return NextResponse.json({ profile: userProfile }, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}