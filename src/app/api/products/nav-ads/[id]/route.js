// api/products/nav-ads/[id]/route.js


import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import NavAd from '@/models/NavAd';

export async function DELETE(req, { params }) {
    await dbConnect();
    const { id } = params;

    try {
        const navAd = await NavAd.findByIdAndDelete(id);

        if (!navAd) {
            return NextResponse.json(
                { success: false, error: 'Nav ad not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Nav ad deleted successfully'
        });
    } catch (error) {
   
        return NextResponse.json(
            { success: false, error: 'Failed to delete nav ad' },
            { status: 500 }
        );
    }
}