import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import dbConnect from '@/lib/dbMongoose';

export async function POST(request) {
    try {
        await dbConnect();
        const orderData = await request.json();
        console.log('Order Data Received:', orderData);

        if (!orderData.orderId || !orderData.products || !orderData.customerInfo) {
            return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
        }

        // Validate district and thana for COD orders in Bangladesh
        if (orderData.paymentMethod === 'cod' && orderData.customerInfo.country === 'Bangladesh') {
            if (!orderData.customerInfo.district || !orderData.customerInfo.thana) {
                return NextResponse.json({ error: 'District and thana are required for COD in Bangladesh' }, { status: 400 });
            }
        }

        const order = new Order({
            ...orderData,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await order.save();
        console.log('Order Saved:', order);

        return NextResponse.json({ message: 'Order created', orderId: order._id }, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');

        if (orderId) {
            const order = await Order.findOne({ orderId }).lean();
            if (!order) {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }
            console.log('Order Fetched:', order);
            return NextResponse.json(order, { status: 200 });
        }

        const orders = await Order.find({}).lean();
        console.log('Orders Fetched:', orders);
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}