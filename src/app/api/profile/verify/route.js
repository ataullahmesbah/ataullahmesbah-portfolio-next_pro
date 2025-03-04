import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';


export async function POST(req) {
    await dbConnect();

    const formData = await req.formData();
    const userId = formData.get('userId');
    const file = formData.get('file');

    if (!userId || !file) {
        return NextResponse.json({ success: false, message: 'Invalid data' });
    }

    const imageUrl = await cloudinary(file, 'verification-docs');

    await UserProfile.findOneAndUpdate(
        { userId },
        { verificationImage: imageUrl, verification: 'pending' }
    );

    return NextResponse.json({ success: true });
}
