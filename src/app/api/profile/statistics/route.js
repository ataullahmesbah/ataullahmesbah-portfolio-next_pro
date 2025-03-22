// api/profile/statistics/Route.js 

import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/dbMongoose';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function GET(req) {
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