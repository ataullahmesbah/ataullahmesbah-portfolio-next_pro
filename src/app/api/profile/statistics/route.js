// api/profile/statistics/Route.js 


import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/dbMongoose';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function GET(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const profiles = await UserProfile.find({}).lean();

        const stats = {
            accepted: profiles.filter(profile => profile.verification === 'accepted').length,
            rejected: profiles.filter(profile => profile.verification === 'rejected').length,
            pending: profiles.filter(profile => profile.verification === 'pending').length,
            not_applied: profiles.filter(profile => profile.verification === 'not_applied').length,
            total: profiles.length,
        };

        return new Response(JSON.stringify({ stats, success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
   
        return new Response(JSON.stringify({
            error: 'Failed to fetch statistics',
            message: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}