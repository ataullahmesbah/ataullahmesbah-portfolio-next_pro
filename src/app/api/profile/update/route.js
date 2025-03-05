// api/profile/update/route.js 


import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbMongoose';
import cloudinary from '@/utils/cloudinary';
import UserProfile from '@/models/UserProfile';


export async function POST(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { intro, bio, description, image } = await req.json();
    const userId = session.user.id;

    if (!userId) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 🔑 Extra Security Check
        const existingProfile = await UserProfile.findOne({ userId });
        if (existingProfile && session?.user?.email !== session.user.email) {
            return Response.json({ message: 'Unauthorized Access Detected' }, { status: 401 });
        }

        let imageUrl = existingProfile?.image || '';

        // Cloudinary Image Upload
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: 'profile_images',
                public_id: `profile_${userId}`,
                overwrite: true,
            });
            imageUrl = uploadResponse.secure_url;
        }


        const profile = await UserProfile.findOneAndUpdate(
            { userId: userId },
            { intro, bio, description, image: imageUrl },
            { new: true, upsert: true }
        );

        return Response.json({ message: 'Profile Updated Successfully', profile });
    } catch (error) {
        console.error(error);
        return Response.json({ message: 'Something went wrong' }, { status: 500 });
    }
}
