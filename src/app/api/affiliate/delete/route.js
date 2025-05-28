// app/api/affiliate/delete/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Affiliate from '@/models/Affiliate';
import AffiliateTransaction from '@/models/AffiliateTransaction';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
        }

        await dbConnect();
        const affiliate = await Affiliate.findById(id);
        if (!affiliate) {
            return NextResponse.json({ message: 'Affiliate not found' }, { status: 404 });
        }

        // Delete affiliate and related transactions
        await Affiliate.deleteOne({ _id: id });
        await AffiliateTransaction.deleteMany({ affiliateId: id });
        console.log('Affiliate deleted:', { id }); // Debug

        return NextResponse.json({ message: 'Affiliate deleted successfully' });
    } catch (error) {
        console.error('Delete affiliate error:', error);
        return NextResponse.json({ message: 'Failed to delete affiliate', error: error.message }, { status: 500 });
    }
}