// api/payment/cancel/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const paymentData = Object.fromEntries(formData);



        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?orderId=${paymentData.tran_id}&status=cancelled`
        );
    } catch (error) {
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?status=cancelled`
        );
    }
}