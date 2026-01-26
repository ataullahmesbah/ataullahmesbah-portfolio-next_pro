// /api/products/orders/update-status/route.js


import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import dbConnect from '@/lib/dbMongoose';

export async function POST(request) {
    try {
        await dbConnect();

        const { orderId, status, paymentDetails } = await request.json();



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

            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }


        return NextResponse.json({
            success: true,
            message: 'Order status updated',
            order: updatedOrder
        });
    } catch (error) {

        return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
    }
}