//api/products/orders/action/route.js

import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import dbConnect from '@/lib/dbMongoose';
import Product from '@/models/Products';
import mongoose from 'mongoose';



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
            // Validate products before accepting
            for (const item of order.products) {
                const product = await Product.findById(item.productId);

                if (!product) {
                    return NextResponse.json({
                        error: `Product "${item.title}" not found in our system. Please contact support.`
                    }, { status: 400 });
                }

                if (product.sizeRequirement === 'Mandatory' && !item.size) {
                    return NextResponse.json({
                        error: `Size is required for "${item.title}"`
                    }, { status: 400 });
                }

                if (item.size && product.sizeRequirement === 'Mandatory') {
                    const sizeData = product.sizes.find(s => s.name === item.size);
                    if (!sizeData) {
                        return NextResponse.json({
                            error: `Size "${item.size}" not found for "${item.title}"`
                        }, { status: 400 });
                    }
                    if (sizeData.quantity < item.quantity) {
                        return NextResponse.json({
                            error: `Insufficient stock for "${item.title}" size "${item.size}". Available: ${sizeData.quantity}, Requested: ${item.quantity}. Cannot accept order.`
                        }, { status: 400 });
                    }
                } else {
                    if (product.quantity < item.quantity) {
                        return NextResponse.json({
                            error: `Insufficient stock for "${item.title}". Available: ${product.quantity}, Requested: ${item.quantity}. Cannot accept order.`
                        }, { status: 400 });
                    }
                }

                if (product.quantity === 0) {
                    return NextResponse.json({
                        error: `"${item.title}" is currently out of stock. Cannot accept order.`
                    }, { status: 400 });
                }

                if (product.productType === 'Affiliate') {
                    return NextResponse.json({
                        error: `"${item.title}" is an affiliate product and cannot be processed.`
                    }, { status: 400 });
                }
            }

            // Update product quantities
            for (const item of order.products) {
                const product = await Product.findById(item.productId);
                if (item.size && product.sizeRequirement === 'Mandatory') {
                    await Product.findByIdAndUpdate(
                        item.productId,
                        {
                            $set: {
                                'sizes.$[elem].quantity': product.sizes.find(s => s.name === item.size).quantity - item.quantity
                            },
                            $inc: { quantity: -item.quantity } // Add this to deduct from total quantity
                        },
                        {
                            arrayFilters: [{ 'elem.name': item.size }]
                        }
                    );
                } else {
                    await Product.findByIdAndUpdate(
                        item.productId,
                        { $inc: { quantity: -item.quantity } }
                    );
                }
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

        return NextResponse.json({ error: 'Failed to process action. Please try again.' }, { status: 500 });
    }
}