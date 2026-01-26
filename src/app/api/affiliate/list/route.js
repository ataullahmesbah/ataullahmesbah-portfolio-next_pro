// app/api/affiliate/list/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Affiliate from '@/models/Affiliate';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';


export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || session.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const affiliates = await Affiliate.find().populate('userId', 'username email');
      
        return NextResponse.json(affiliates);
    } catch (error) {
    
        return NextResponse.json({ message: 'Failed to fetch affiliates', error: error.message }, { status: 500 });
    }
}