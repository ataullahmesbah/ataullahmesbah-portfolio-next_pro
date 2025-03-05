import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';


export async function GET(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    await dbConnect();

    const { id } = params;

    try {
        const profile = await UserProfile.findOne({ userId: id });
        if (!profile) {
            return new Response(JSON.stringify({ message: 'Profile not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ profile }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
}