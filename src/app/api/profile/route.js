// src>app>profile>route.js

import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import cloudinary from '@/utils/cloudinary';
import { getSession } from 'next-auth/react';


export default async function handler(req, res) {
    await dbConnect();

    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        const { image } = req.body;

        try {
            const result = await cloudinary.uploader.upload(image, {
                folder: 'verification',
            });

            const profile = await UserProfile.findOneAndUpdate(
                { userId: session.user.id },
                { verificationImage: result.secure_url, verification: 'pending' },
                { new: true, upsert: true }
            );

            res.status(200).json({ profile });
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}