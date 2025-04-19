import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Affiliate from '@/models/Affiliate';
import { getServerSession } from 'next-auth/next';
import shortUUID from 'short-uuid';
import { authOptions } from '../../auth/[...nextauth]/route';



export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id, status } = await request.json();
        if (!id || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
        }

        await dbConnect();
        const affiliate = await Affiliate.findById(id);
        if (!affiliate) {
            return NextResponse.json({ message: 'Affiliate not found' }, { status: 404 });
        }

        affiliate.status = status;
        if (status === 'approved') {
            affiliate.affiliateCode = shortUUID.generate();
        }
        await affiliate.save();
        console.log('Affiliate updated:', affiliate); // Debug update

        return NextResponse.json({ message: `Affiliate ${status}`, affiliate });
    } catch (error) {
        console.error('Manage affiliate error:', error);
        return NextResponse.json({ message: 'Failed to manage affiliate', error: error.message }, { status: 500 });
    }
}