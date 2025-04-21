
// src/api/profile/upload/route.js

import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import cloudinary from '@/utils/cloudinary';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';


export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const formData = await req.formData();
    const file = formData.get('image');
    const userId = session.user.id;

    if (!file || !userId) {
      return NextResponse.json({ error: 'File and userId are required' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          format: 'webp',
          quality: 'auto:good',
          folder: 'profile_verifications',
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(fileBuffer);
    });

    let userProfile = await UserProfile.findOne({ userId });
    if (userProfile) {
      userProfile.verificationImage = result.secure_url;
      userProfile.verification = 'pending';
    } else {
      userProfile = new UserProfile({
        userId,
        verificationImage: result.secure_url,
        verification: 'pending',
      });
    }
    await userProfile.save();

    return NextResponse.json({ profile: userProfile }, { status: 200 });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}