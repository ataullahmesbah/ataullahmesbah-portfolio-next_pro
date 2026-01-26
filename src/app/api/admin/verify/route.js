import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';



export async function GET(request) {
    await dbConnect();

    try {
        const pending = await UserProfile.find({ verification: 'pending' }, 'slug displayName verification userId verificationImage')
            .populate('userId', 'username email')
            .lean();
        const verified = await UserProfile.find({ verification: 'accepted' }, 'slug displayName verification userId verificationImage')
            .populate('userId', 'username email')
            .lean();

        return new Response(JSON.stringify({ pending, verified }), { status: 200 });
    } catch (error) {

        return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
}

export async function PUT(request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    await dbConnect();

    try {
        const { id, status } = await request.json();

        if (!['accepted', 'rejected'].includes(status)) {
            return new Response(JSON.stringify({ message: 'Invalid status' }), { status: 400 });
        }

        const profile = await UserProfile.findByIdAndUpdate(
            id,
            { verification: status },
            { new: true }
        ).populate('userId', 'username email');

        if (!profile) {
            return new Response(JSON.stringify({ message: 'Profile not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ profile }), { status: 200 });
    } catch (error) {

        return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
}

export async function DELETE(request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    await dbConnect();

    try {
        const { id } = await request.json();

        const deletedProfile = await UserProfile.findByIdAndDelete(id);

        if (!deletedProfile) {
            return new Response(JSON.stringify({ message: 'Profile not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'User profile deleted successfully' }), { status: 200 });
    } catch (error) {

        return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
}