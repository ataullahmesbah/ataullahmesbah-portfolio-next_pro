import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import dbConnect from '@/lib/dbMongoose';
import Coupon from '@/models/Coupon';
import Config from '@/models/Config';


export async function GET(request) {
    try {
        console.log('Attempting to connect to MongoDB for GET /api/products/orders');
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('orderId');
        const status = searchParams.get('status');
        const date = searchParams.get('date');
        console.log('GET /api/products/orders with params:', { orderId, status, date });

        let query = {};
        if (orderId) {
            query.orderId = orderId;
        }
        if (status) {
            query.status = status.split(','); // Support multiple statuses (e.g., pending,pending_payment)
        }
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1);
            query.createdAt = { $gte: startDate, $lt: endDate };
        }

        console.log('Querying orders with:', query);
        const orders = await Order.find(query).lean();
        console.log('Orders query result:', orders);

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error('Error in GET /api/products/orders:', error.message, error.stack);
        return NextResponse.json({ error: `Failed to fetch orders: ${error.message}` }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        console.log('Attempting to connect to MongoDB for POST /api/products/orders');
        await dbConnect();
        console.log('Connected to MongoDB, processing order data');
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
        console.log('Received order data:', { orderId, couponCode, total, discount, customerInfo });

        // Validate required fields
        if (!orderId || !products || !customerInfo || !paymentMethod || !status || total == null) {
            console.log('Validation failed: Missing required fields');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate customerInfo fields
        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
            console.log('Validation failed: Missing required customerInfo fields');
            return NextResponse.json({ error: 'Missing required customer information (name, email, phone, address)' }, { status: 400 });
        }

        if (paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' && (!customerInfo.district || !customerInfo.thana)) {
            console.log('Validation failed: Missing district or thana for COD');
            return NextResponse.json({ error: 'District and thana required for COD orders' }, { status: 400 });
        }

        // Validate coupon if provided
        if (couponCode) {
            console.log('Validating coupon:', couponCode);
            // Check product-specific coupon
            const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
            if (coupon) {
                console.log('Product coupon found:', coupon);
                if (!products.some(p => p.productId === coupon.productId?.toString())) {
                    console.log('Coupon not applicable to products');
                    return NextResponse.json({ error: 'Coupon not applicable to products' }, { status: 400 });
                }
                if (coupon.expiresAt && coupon.expiresAt < new Date()) {
                    console.log('Coupon expired');
                    return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
                }
            } else {
                // Check global coupon
                const globalCoupon = await Config.findOne({ key: 'globalCoupon', 'value.code': couponCode });
                if (!globalCoupon) {
                    console.log('Coupon not found in Config');
                    return NextResponse.json({ error: 'Coupon not found' }, { status: 400 });
                }
                console.log('Global coupon found:', globalCoupon.value);
                const { discountAmount, minCartTotal, expiresAt } = globalCoupon.value;
                const productTotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
                if (productTotal < minCartTotal) {
                    console.log('Cart total below minCartTotal');
                    return NextResponse.json({ error: `Cart total must be at least ৳${minCartTotal}` }, { status: 400 });
                }
                if (expiresAt && new Date(expiresAt) < new Date()) {
                    console.log('Global coupon expired');
                    return NextResponse.json({ error: 'Global coupon has expired' }, { status: 400 });
                }
                if (discount !== discountAmount) {
                    console.log('Discount mismatch:', { expected: discountAmount, received: discount });
                    return NextResponse.json({ error: 'Invalid discount amount' }, { status: 400 });
                }
            }
        }

        console.log('Creating order');
        const order = await Order.create({
            orderId,
            products,
            customerInfo,
            paymentMethod,
            status,
            total,
            discount: discount || 0,
            shippingCharge: shippingCharge || 0,
            couponCode: couponCode || null,
        });
        console.log('Order created:', order);

        return NextResponse.json({ message: 'Order created', orderId }, { status: 200 });
    } catch (error) {
        console.error('Error in POST /api/products/orders:', error.message, error.stack);
        return NextResponse.json({ error: `Failed to create order: ${error.message}` }, { status: 500 });
    }
}