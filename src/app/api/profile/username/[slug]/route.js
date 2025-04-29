// app/api/profile/username/[slug]/route.js

import dbConnect from "@/lib/dbMongoose";
import UserProfile from "@/models/UserProfile";

export async function GET(request, { params }) {
    await dbConnect();
    const { slug } = params;

    try {
        const profile = await UserProfile.findOne({ slug })
            .populate('userId', 'createdAt email')
            .lean();

        if (!profile) {
            return Response.json({ success: false, message: 'Profile not found' }, { status: 404 });
        }

        const responseData = {
            profile: { ...profile },
            user: {
                memberSince: profile.userId.createdAt,
                email: profile.userId.email
            }
        };

        return Response.json({ success: true, data: responseData });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return Response.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}