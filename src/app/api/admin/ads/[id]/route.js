// app/api/admin/ads/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbMongoose';
import Ads from '@/models/Ads';

export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const data = await req.json();

        const updatedAd = await Ads.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );

        if (!updatedAd) {
            return NextResponse.json({ message: 'Ad not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Ad updated successfully', ad: updatedAd });
    } catch (error) {
        console.error('Update ad error:', error);
        return NextResponse.json({ message: 'Failed to update ad' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = params;

        const deletedAd = await Ads.findByIdAndDelete(id);

        if (!deletedAd) {
            return NextResponse.json({ message: 'Ad not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Ad deleted successfully' });
    } catch (error) {
        console.error('Delete ad error:', error);
        return NextResponse.json({ message: 'Failed to delete ad' }, { status: 500 });
    }
}