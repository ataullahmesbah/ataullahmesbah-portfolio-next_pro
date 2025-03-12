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
        const file = formData.get('image');

        if (!file) {
            return new Response(JSON.stringify({ message: 'No file uploaded' }), { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload file to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'verification' },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        let profile = await UserProfile.findOne({ userId: session.user.id });

        if (!profile) {
            profile = new UserProfile({
                userId: session.user.id,
                verificationImage: result.secure_url,
                verification: 'pending',
            });
        } else {
            profile.verificationImage = result.secure_url;
            profile.verification = 'pending';
        }

        await profile.save();
        return new Response(JSON.stringify({ profile }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
}
