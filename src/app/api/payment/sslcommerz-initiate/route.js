// api/payment/sslcommerz-initiate/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        const { total_amount, customerInfo, orderData } = await request.json();

        const sslcommerzData = {
            store_id: process.env.NEXT_PUBLIC_SSLCZ_STORE_ID,
            store_passwd: process.env.SSLCZ_STORE_PASSWORD,
            total_amount: total_amount,
            currency: 'BDT',
            tran_id: orderData.orderId,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`,
            fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/cancel`,
            ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/ipn`,
            cus_name: customerInfo.name,
            cus_email: customerInfo.email,
            cus_add1: customerInfo.address,
            cus_city: customerInfo.city || 'Dhaka',
            cus_postcode: customerInfo.postcode || '1200',
            cus_country: 'Bangladesh',
            cus_phone: customerInfo.phone,
            shipping_method: 'NO',
            product_name: 'Online Purchase',
            product_category: 'General',
            product_profile: 'general',
        };

        const response = await axios.post(
            process.env.NEXT_PUBLIC_SSLCZ_IS_SANDBOX === 'true'
                ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
                : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php',
            sslcommerzData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('SSLCommerz initiation error:', error);
        return NextResponse.json(
            { error: 'Payment initiation failed', details: error.message },
            { status: 500 }
        );
    }
}