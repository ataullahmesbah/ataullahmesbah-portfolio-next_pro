import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbMongoose';
import UserProfile from '@/models/UserProfile';


export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { userId, status } = await req.json();
        if (!['accepted', 'rejected'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        const profile = await UserProfile.findOneAndUpdate(
            { userId },
            { verification: status },
            { new: true }
        );

        if (!profile) {
            return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json({ message: `Verification ${status}`, profile });
    } catch (error) {
        console.error('Error verifying profile:', error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
}