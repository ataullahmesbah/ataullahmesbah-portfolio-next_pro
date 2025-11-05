// api/payment/ipn/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const ipnData = Object.fromEntries(formData);

        console.log('IPN Data:', ipnData);

        // Handle IPN - Update database, send emails, etc.
        if (ipnData.status === 'VALID') {
            await updateOrderStatus(ipnData.tran_id, 'accepted', {
                paymentStatus: 'paid',
                ipnReceived: true
            });
        }

        return NextResponse.json({ status: 'IPN_RECEIVED' });
    } catch (error) {
        console.error('IPN processing error:', error);
        return NextResponse.json({ error: 'IPN_FAILED' }, { status: 500 });
    }
}

async function updateOrderStatus(orderId, status, details) {
    // Your order status update logic
}