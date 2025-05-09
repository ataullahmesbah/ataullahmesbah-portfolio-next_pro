import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import dbConnect from '@/lib/dbMongoose';

export async function POST(request) {
    try {
        await dbConnect();
        const orderData = await request.json();

        if (!orderData.orderId || !orderData.products || !orderData.customerInfo) {
            return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
        }

        const order = new Order({
            ...orderData,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await order.save();

        return NextResponse.json({ message: 'Order created', orderId: order._id }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const orders = await Order.find({}).lean();
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}