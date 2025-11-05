// /api/products/orders/update-status/route.js


import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import dbConnect from '@/lib/dbMongoose';

export async function POST(request) {
    try {
        await dbConnect();

        const { orderId, status, paymentDetails } = await request.json();

        console.log('📦 Updating order:', orderId, 'to status:', status);

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderId },
            {
                status: status,
                paymentDetails: paymentDetails,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedOrder) {
            console.log('❌ Order not found:', orderId);
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        console.log('✅ Order updated successfully:', updatedOrder.orderId);
        return NextResponse.json({
            success: true,
            message: 'Order status updated',
            order: updatedOrder
        });
    } catch (error) {
        console.error('❌ Order status update error:', error);
        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }
}