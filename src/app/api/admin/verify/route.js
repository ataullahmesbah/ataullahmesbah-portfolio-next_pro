

import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';


export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    await dbConnect();

    try {
        // Fetch all profiles with verification status 'pending'
        const profiles = await UserProfile.find({ verification: 'pending' }).populate('userId');
        return new Response(JSON.stringify({ profiles }), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
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

        // Update the verification status
        const profile = await UserProfile.findByIdAndUpdate(
            id,
            { verification: status },
            { new: true }
        );

        if (!profile) {
            return new Response(JSON.stringify({ message: 'Profile not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ profile }), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
    }
}