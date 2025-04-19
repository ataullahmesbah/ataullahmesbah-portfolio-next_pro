import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbMongoose';
import Affiliate from '@/models/Affiliate';
import { authOptions } from '../../auth/[...nextauth]/route';



export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        console.log('Session:', session); // Debug session

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: 'Unauthorized: No valid session' }, { status: 401 });
        }

        await dbConnect();
        const existingAffiliate = await Affiliate.findOne({ userId: session.user.id });
        if (existingAffiliate) {
            return NextResponse.json({ message: 'Affiliate request already exists' }, { status: 400 });
        }

        const affiliate = await Affiliate.create({ userId: session.user.id });
        console.log('Affiliate created:', affiliate); // Debug creation
        return NextResponse.json({ message: 'Affiliate request submitted', affiliate }, { status: 201 });
    } catch (error) {
        console.error('Apply affiliate error:', error);
        return NextResponse.json({ message: 'Failed to apply', error: error.message }, { status: 500 });
    }
}