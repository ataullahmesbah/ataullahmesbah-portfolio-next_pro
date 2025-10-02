//api/products/orders/route.js

import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';
import Config from '@/models/Config';
import dbConnect from '@/lib/dbMongoose';
import UsedCoupon from '@/models/UsedCoupon';
import Product from '@/models/Products';


export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');
        const status = searchParams.get('status');
        const date = searchParams.get('date');

        let query = {};
        if (orderId) {
            query.orderId = orderId;
        }
        if (status) {
            query.status = status.split(',');
        }
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);
            query.createdAt = { $gte: startDate, $lt: endDate };
        }

        const orders = await Order.find(query).lean();
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch orders: ${error.message}` }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const {
            orderId,
            products,
            customerInfo,
            paymentMethod,
            status,
            total,
            discount,
            shippingCharge,
            couponCode,
        } = await request.json();

        
        // Validate required fields
        if (!orderId || !products || !customerInfo || !paymentMethod || !status || total == null) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate customerInfo fields
        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
            return NextResponse.json({ error: 'Missing required customer information (name, email, phone, address)' }, { status: 400 });
        }

        if (paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' && (!customerInfo.district || !customerInfo.thana)) {
            return NextResponse.json({ error: 'District and thana required for COD orders' }, { status: 400 });
        }

        // Validate product quantities and sizes
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return NextResponse.json({ error: `Product not found for ID ${item.productId}` }, { status: 400 });
            }

            if (product.sizeRequirement === 'Mandatory' && !item.size) {
                return NextResponse.json({ error: `Size is required for product ${product.title}` }, { status: 400 });
            }

            if (item.size && product.sizeRequirement === 'Mandatory') {
                const sizeData = product.sizes.find(s => s.name === item.size);
                if (!sizeData) {
                    return NextResponse.json({ error: `Invalid size ${item.size} for product ${product.title}` }, { status: 400 });
                }
                if (item.quantity > sizeData.quantity) {
                    return NextResponse.json({ error: `Insufficient stock for ${product.title} size ${item.size}` }, { status: 400 });
                }
            } else if (item.quantity > product.quantity) {
                return NextResponse.json({ error: `Insufficient stock for ${product.title}` }, { status: 400 });
            }
        }

        // Validate coupon if provided
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
            if (coupon) {
                if (!products.some(p => p.productId === coupon.productId?.toString())) {
                    return NextResponse.json({ error: 'Coupon not applicable to products' }, { status: 400 });
                }
                if (coupon.expiresAt && coupon.expiresAt < new Date()) {
                    return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
                }
                if (coupon.useType === 'one-time') {
                    const usedCoupon = await UsedCoupon.findOne({
                        couponCode,
                        $or: [{ email: customerInfo.email }, { phone: customerInfo.phone }],
                    });
                    if (usedCoupon) {
                        return NextResponse.json({ error: 'Coupon already used with this email or phone number' }, { status: 400 });
                    }
                }
            } else {
                const globalCoupon = await Config.findOne({
                    key: 'globalCoupon',
                    'value.code': { $regex: `^${couponCode}$`, $options: 'i' }
                });
                if (!globalCoupon || !globalCoupon.value || !globalCoupon.value.code) {
                    return NextResponse.json({ error: 'Coupon not found' }, { status: 400 });
                }
                const { discountAmount, minCartTotal, expiresAt } = globalCoupon.value;
                if (!Number.isFinite(discountAmount) || !Number.isFinite(minCartTotal)) {
                    return NextResponse.json({ error: 'Invalid coupon configuration' }, { status: 400 });
                }
                const productTotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
                if (productTotal < minCartTotal) {
                    return NextResponse.json({ error: `Cart total must be at least ৳${minCartTotal}` }, { status: 400 });
                }
                if (expiresAt && new Date(expiresAt) < new Date()) {
                    return NextResponse.json({ error: 'Global coupon has expired' }, { status: 400 });
                }
                if (discount !== discountAmount) {
                    return NextResponse.json({ error: 'Invalid discount amount' }, { status: 400 });
                }
            }
        }

        // Create order with validated products
        const order = await Order.create({
            orderId,
            products: products.map(item => ({
                productId: item.productId,
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                mainImage: item.mainImage || null,
                size: item.size || null
            })),
            customerInfo,
            paymentMethod,
            status,
            total,
            discount: discount || 0,
            shippingCharge: shippingCharge || 0,
            couponCode: couponCode || null,
        });

        // Debug: Log saved order
        const savedOrder = await Order.findById(order._id).lean();
       

        return NextResponse.json({ message: 'Order created', orderId }, { status: 200 });
    } catch (error) {
       
        return NextResponse.json({ error: `Failed to create order: ${error.message}` }, { status: 500 });
    }
}