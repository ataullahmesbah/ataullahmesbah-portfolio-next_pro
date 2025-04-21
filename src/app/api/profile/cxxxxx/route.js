// api/profile/[id]/route.js 


import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/dbMongoose';


export async function GET(req, { params }) {
    await dbConnect();

    try {
        // Public profile access (no session required)
        const profile = await UserProfile.findOne({ userId: params.id })
            .populate('userId', 'name email username role'); // Populate user details

        if (!profile) {
            return Response.json({ message: 'Profile not found' }, { status: 404 });
        }

        // Return public profile data
        const publicProfile = {
            image: profile.image,
            intro: profile.intro,
            bio: profile.bio,
            description: profile.description,
            verification: profile.verification,
            user: {
                name: profile.userId.name,
                username: profile.userId.username,
                role: profile.userId.role
            }
        };

        return Response.json({ profile: publicProfile });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return Response.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function POST(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const profiles = await UserProfile.find({});

        const stats = {
            accepted: profiles.filter(profile => profile.verification === 'accepted').length,
            rejected: profiles.filter(profile => profile.verification === 'rejected').length,
            pending: profiles.filter(profile => profile.verification === 'pending').length,
            not_applied: profiles.filter(profile => profile.verification === 'not_applied').length,
        };

        return Response.json({ stats });
    } catch (error) {
        console.error("Error fetching user profile statistics:", error);
        return Response.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }
}