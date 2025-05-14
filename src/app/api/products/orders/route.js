import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import dbConnect from '@/lib/dbMongoose';


export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const order = await Order.findOne({ orderId });
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch order: ${error.message}` }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const orderData = await request.json();

        if (!orderData.orderId || !orderData.products || !orderData.customerInfo) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const order = await Order.create(orderData);
        return NextResponse.json({ message: 'Order created', orderId: order.orderId }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to create order: ${error.message}` }, { status: 500 });
    }
}