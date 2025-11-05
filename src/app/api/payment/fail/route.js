// /api/payment/fail/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const paymentData = Object.fromEntries(formData);

        console.log('Payment Failed Data:', paymentData);

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failed?orderId=${paymentData.tran_id}&reason=payment_failed`
        );
    } catch (error) {
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failed?reason=error`
        );
    }
}