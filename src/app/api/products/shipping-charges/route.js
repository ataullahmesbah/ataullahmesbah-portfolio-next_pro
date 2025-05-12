import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import ShippingCharge from '@/models/ShippingCharge';


export async function GET() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const charges = await ShippingCharge.find({});
        return NextResponse.json(charges, { status: 200 });
    } catch (error) {
        console.error('Error fetching shipping charges:', error);
        return NextResponse.json({ error: 'Failed to fetch shipping charges' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const { division, charge } = await request.json();
        const existingCharge = await ShippingCharge.findOne({ division });
        if (existingCharge) {
            existingCharge.charge = charge;
            existingCharge.updatedAt = Date.now();
            await existingCharge.save();
        } else {
            await ShippingCharge.create({ division, charge });
        }
        return NextResponse.json({ message: 'Shipping charge updated' }, { status: 200 });
    } catch (error) {
        console.error('Error updating shipping charge:', error);
        return NextResponse.json({ error: 'Failed to update shipping charge' }, { status: 500 });
    }
}