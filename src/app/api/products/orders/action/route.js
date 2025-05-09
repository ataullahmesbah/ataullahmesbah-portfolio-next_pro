import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbMongoose';

export async function POST(request) {
    try {
        await dbConnect();
        const { orderId, action } = await request.json();

        if (!orderId || !['accept', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const order = await Order.findOne({ orderId });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (action === 'accept') {
            const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
                quantity: Number,
            }));
            for (const product of order.products) {
                await Product.updateOne(
                    { _id: new mongoose.Types.ObjectId(product.productId) },
                    { $inc: { quantity: -product.quantity } }
                );
            }
            await Order.updateOne(
                { orderId },
                { $set: { status: 'accepted', updatedAt: new Date() } }
            );
        } else {
            await Order.updateOne(
                { orderId },
                { $set: { status: 'rejected', updatedAt: new Date() } }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(`Error performing ${action} on order:`, error);
        return NextResponse.json({ error: 'Failed to process action' }, { status: 500 });
    }
}