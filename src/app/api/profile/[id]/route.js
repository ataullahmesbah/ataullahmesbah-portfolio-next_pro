import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/dbMongoose';


export async function GET(req, { params }) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
        return Response.json({ message: 'Profile not found' }, { status: 404 });
    }

    return Response.json({ profile });
}
