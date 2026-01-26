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
            status = 'pending', // ✅ Default value add করুন
            total,
            discount = 0,
            shippingCharge = 0,
            couponCode = null,
        } = await request.json();

        // ✅ Validate required fields (status remove করুন, কারণ default আছে)
        if (!orderId || !products || !customerInfo || !paymentMethod || total == null) {
            return NextResponse.json({ 
                error: 'Missing required fields',
                required: ['orderId', 'products', 'customerInfo', 'paymentMethod', 'total']
            }, { status: 400 });
        }

        // ✅ Validate customerInfo fields
        if (!customerInfo.name?.trim() || !customerInfo.email?.trim() || !customerInfo.phone?.trim() || !customerInfo.address?.trim()) {
            return NextResponse.json({ 
                error: 'Missing required customer information',
                required: ['name', 'email', 'phone', 'address']
            }, { status: 400 });
        }

        // ✅ Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerInfo.email)) {
            return NextResponse.json({ 
                error: 'Invalid email format' 
            }, { status: 400 });
        }

       // In the POST function:
if (customerInfo.country === 'Bangladesh') {
    const cleanPhone = customerInfo.phone.replace(/\D/g, '');
    
    // Check if it's already formatted correctly
    if (cleanPhone.length !== 11) {
        return NextResponse.json({ 
            error: 'Bangladesh phone number must be 11 digits' 
        }, { status: 400 });
    }
    
     // Accept both formats: 017... or 88017...
    if (!/^(01|8801)[3-9]/.test(cleanPhone)) {
        return NextResponse.json({ 
            error: 'Invalid Bangladesh phone number. Must start with 01 (01XXXXXXXXX)' 
        }, { status: 400 });
    }
    
    // Normalize to 11-digit format for storage
    let normalizedPhone = cleanPhone;
    if (cleanPhone.startsWith('880')) {
        normalizedPhone = '0' + cleanPhone.slice(3);
    }
    
    // Update customerInfo with normalized phone
    customerInfo.phone = normalizedPhone;
}

        // ✅ Bkash validation
        if (paymentMethod === 'bkash') {
            if (!customerInfo.bkashNumber || !customerInfo.transactionId) {
                return NextResponse.json({ 
                    error: 'Bkash number and Transaction ID required for Bkash payment' 
                }, { status: 400 });
            }
            const cleanBkashNumber = customerInfo.bkashNumber.replace(/\D/g, '');
            if (cleanBkashNumber.length !== 11) {
                return NextResponse.json({ 
                    error: 'Invalid Bkash number. Must be 11 digits.' 
                }, { status: 400 });
            }
        }

        // ✅ District & Thana validation for Bangladesh
        if ((paymentMethod === 'cod' || paymentMethod === 'bkash') && customerInfo.country === 'Bangladesh') {
            if (!customerInfo.district?.trim() || !customerInfo.thana?.trim()) {
                return NextResponse.json({ 
                    error: 'District and thana required for COD and Bkash orders in Bangladesh' 
                }, { status: 400 });
            }
        }

        // ✅ Validate product quantities and sizes
        const validationErrors = [];
        
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                validationErrors.push(`Product not found for ID ${item.productId}`);
                continue;
            }

            // ✅ Stock availability check
            if (product.availability !== 'InStock') {
                validationErrors.push(`${product.title} is currently out of stock`);
                continue;
            }

            if (product.sizeRequirement === 'Mandatory' && !item.size) {
                validationErrors.push(`Size is required for product "${product.title}"`);
                continue;
            }

            if (item.size && product.sizeRequirement === 'Mandatory') {
                const sizeData = product.sizes.find(s => s.name === item.size);
                if (!sizeData) {
                    validationErrors.push(`Size "${item.size}" not available for "${product.title}"`);
                    continue;
                }
                if (item.quantity > sizeData.quantity) {
                    validationErrors.push(`Only ${sizeData.quantity} units available for "${product.title}" (size: ${item.size})`);
                    continue;
                }
            } else if (item.quantity > product.quantity) {
                validationErrors.push(`Only ${product.quantity} units available for "${product.title}"`);
                continue;
            }
        }

        if (validationErrors.length > 0) {
            return NextResponse.json({ 
                error: 'Product validation failed',
                details: validationErrors 
            }, { status: 400 });
        }

        // ✅ Validate coupon if provided
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
            if (coupon) {
                if (!products.some(p => p.productId === coupon.productId?.toString())) {
                    return NextResponse.json({ 
                        error: 'Coupon not applicable to selected products' 
                    }, { status: 400 });
                }
                if (coupon.expiresAt && coupon.expiresAt < new Date()) {
                    return NextResponse.json({ 
                        error: 'Coupon has expired' 
                    }, { status: 400 });
                }
                if (coupon.useType === 'one-time') {
                    const usedCoupon = await UsedCoupon.findOne({
                        couponCode,
                        $or: [
                            { email: customerInfo.email },
                            { phone: customerInfo.phone }
                        ],
                    });
                    if (usedCoupon) {
                        return NextResponse.json({ 
                            error: 'Coupon already used with this email or phone number' 
                        }, { status: 400 });
                    }
                }
            } else {
                const globalCoupon = await Config.findOne({
                    key: 'globalCoupon',
                    'value.code': { $regex: `^${couponCode}$`, $options: 'i' }
                });
                
                if (!globalCoupon?.value?.code) {
                    return NextResponse.json({ 
                        error: 'Invalid coupon code' 
                    }, { status: 400 });
                }
                
                const { discountAmount, minCartTotal, expiresAt } = globalCoupon.value;
                if (!Number.isFinite(discountAmount) || !Number.isFinite(minCartTotal)) {
                    return NextResponse.json({ 
                        error: 'Invalid coupon configuration' 
                    }, { status: 400 });
                }
                
                const productTotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
                if (productTotal < minCartTotal) {
                    return NextResponse.json({ 
                        error: `Cart total must be at least ৳${minCartTotal} to use this coupon` 
                    }, { status: 400 });
                }
                
                if (expiresAt && new Date(expiresAt) < new Date()) {
                    return NextResponse.json({ 
                        error: 'Coupon has expired' 
                    }, { status: 400 });
                }
                
                if (discount !== discountAmount) {
                    return NextResponse.json({ 
                        error: 'Invalid discount amount applied' 
                    }, { status: 400 });
                }
            }
        }

        // ✅ Create order
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
            customerInfo: {
                ...customerInfo,
                phone: customerInfo.phone.replace(/\D/g, ''), // ✅ Clean phone number
                ...(customerInfo.bkashNumber && { 
                    bkashNumber: customerInfo.bkashNumber.replace(/\D/g, '') 
                })
            },
            paymentMethod,
            status,
            total,
            discount: discount || 0,
            shippingCharge: shippingCharge || 0,
            couponCode: couponCode || null,
        });

        // ✅ Update product quantities after successful order
        for (const item of products) {
            const product = await Product.findById(item.productId);
            
            if (item.size && product.sizeRequirement === 'Mandatory') {
                await Product.findOneAndUpdate(
                    { 
                        _id: item.productId,
                        'sizes.name': item.size 
                    },
                    { 
                        $inc: { 
                            'sizes.$.quantity': -item.quantity,
                            quantity: -item.quantity 
                        } 
                    }
                );
            } else {
                await Product.findByIdAndUpdate(
                    item.productId,
                    { $inc: { quantity: -item.quantity } }
                );
            }
        }

        console.log('✅ Order created successfully:', {
            orderId: order.orderId,
            customerEmail: order.customerInfo.email,
            total: order.total,
            status: order.status
        });

        return NextResponse.json({ 
            success: true,
            message: 'Order created successfully',
            orderId: order.orderId,
            orderDetails: {
                id: order._id,
                status: order.status,
                total: order.total,
                customerName: order.customerInfo.name
            }
        }, { status: 201 }); // ✅ 201 status for resource creation

    } catch (error) {
        console.error('❌ Order creation error:', {
            message: error.message,
            code: error.code,
            name: error.name
        });

        // ✅ Duplicate orderId error handling
        if (error.code === 11000) {
            return NextResponse.json({ 
                error: 'Order ID already exists. Please try again.',
                code: 'DUPLICATE_ORDER'
            }, { status: 409 });
        }

        // ✅ Validation error handling
        if (error.name === 'ValidationError') {
            return NextResponse.json({ 
                error: 'Order validation failed',
                details: error.errors 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            error: 'Failed to create order',
            ...(process.env.NODE_ENV === 'development' && { debug: error.message })
        }, { status: 500 });
    }
}