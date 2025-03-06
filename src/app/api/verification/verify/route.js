// api/verification/verify/route.js 


import { getServerSession } from 'next-auth/next';
import cloudinary from '@/utils/cloudinary';
import dbConnect from '@/lib/dbMongoose';
import { authOptions } from '../../auth/[...nextauth]/route';
import UserProfile from '@/models/UserProfile';



export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    await dbConnect();

    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload file to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'verification' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary Error:', error);
                        reject(error);
                    } else {
                        console.log('Cloudinary Result:', result);
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        // Update user profile with verification image and set status to 'pending'
        const profile = await UserProfile.findOneAndUpdate(
            { userId: session.user.id },
            {
                $set: {
                    verificationImage: result.secure_url, // Save Cloudinary URL
                    verification: 'pending' // Set status to 'pending'
                }
            },
            { new: true, upsert: true }
        ).populate('userId');

        console.log('Updated Profile:', profile); // Debugging

        return new Response(JSON.stringify({ profile }), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
}