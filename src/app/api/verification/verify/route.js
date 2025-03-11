// api/verification/verify/route.js 
import { getServerSession } from 'next-auth/next';
import cloudinary from '@/utils/cloudinary';
import dbConnect from '@/lib/dbMongoose';
import { authOptions } from '../../auth/[...nextauth]/route';
import UserProfile from '@/models/UserProfile';

export async function POST(request) {
    const session = await getServerSession(authOptions);
    console.log('Session:', session); // Debug session
    if (!session) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    await dbConnect();

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        console.log('File:', file); // Debug file

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
                        console.error('Cloudinary Error:', error); // Debug Cloudinary error
                        reject(error);
                    } else {
                        console.log('Cloudinary Result:', result); // Debug Cloudinary result
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        // Debug: Check the Cloudinary result
        console.log('Cloudinary Secure URL:', result.secure_url);

        // Update user profile with verification image and set status to 'pending'
        let profile = await UserProfile.findOne({ userId: session.user.id });

        if (!profile) {
            // Create a new UserProfile document if it doesn't exist
            profile = new UserProfile({
                userId: session.user.id,
                verificationImage: result.secure_url,
                verification: 'pending',
            });
        } else {
            // Update the existing UserProfile document
            profile.verificationImage = result.secure_url;
            profile.verification = 'pending';
        }

        await profile.save(); // Save the document
        console.log('Updated Profile:', profile); // Debug updated profile

        return new Response(JSON.stringify({ profile }), { status: 200 });
    } catch (error) {
        console.error('Error:', error); // Debug error
        return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
}