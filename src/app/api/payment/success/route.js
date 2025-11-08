// app/api/payment/success/route.js
import { NextResponse } from 'next/server';

// Lazy DB Connect (যদি দরকার হয়)
import dbConnect from '@/lib/dbMongoose';

export async function POST(request) {
    try {
        // DB কানেক্ট (যদি অর্ডার আপডেট করতে হয়)
        await dbConnect();

        const formData = await request.formData();
        const paymentData = Object.fromEntries(formData);

        console.log('Payment Success Data:', paymentData);

        const {
            tran_id,
            status,
            val_id,
            amount,
            bank_tran_id,
            card_type
        } = paymentData;

        // tran_id না থাকলে error
        if (!tran_id) {
            console.error('Missing tran_id');
            return NextResponse.redirect(
                new URL('/checkout/error?message=no_order_id', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
                303
            );
        }

        // Payment VALID?
        if (status === 'VALID' || status === 'VALIDATED') {
            console.log('Payment validated for:', tran_id);

            // অর্ডার স্ট্যাটাস আপডেট (যদি API থাকে)
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
                const updateRes = await fetch(`${baseUrl}/api/products/orders/update-status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: tran_id,
                        status: 'accepted',
                        paymentDetails: {
                            paymentStatus: 'paid',
                            paymentMethod: 'online',
                            transactionId: val_id,
                            bankTransactionId: bank_tran_id,
                            amount,
                            cardType: card_type
                        }
                    }),
                });

                if (updateRes.ok) {
                    console.log('Order updated to accepted');
                } else {
                    console.warn('Failed to update order status');
                }
            } catch (err) {
                console.error('Order update error:', err);
            }

            // Success Page এ রিডাইরেক্ট (303 = force GET)
            const redirectUrl = new URL('/checkout/success', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
            redirectUrl.searchParams.set('orderId', tran_id);
            redirectUrl.searchParams.set('payment', 'success');
            redirectUrl.searchParams.set('clearCart', 'true');

            console.log('Redirecting to:', redirectUrl.toString());
            return NextResponse.redirect(redirectUrl, 303); // 303 = GET

        } else {
            // Payment Failed
            const redirectUrl = new URL('/checkout/failed', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
            redirectUrl.searchParams.set('orderId', tran_id || 'unknown');
            redirectUrl.searchParams.set('reason', 'payment_failed');
            return NextResponse.redirect(redirectUrl, 303);
        }

    } catch (error) {
        console.error('Payment success handler error:', error);
        const redirectUrl = new URL('/checkout/error', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
        redirectUrl.searchParams.set('message', 'server_error');
        return NextResponse.redirect(redirectUrl, 303);
    }
}

// Optional: GET handler (SSL IPN)
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const tran_id = searchParams.get('tran_id');
    const status = searchParams.get('status');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    if (tran_id && (status === 'VALID' || status === 'VALIDATED')) {
        const redirectUrl = new URL('/checkout/success', baseUrl);
        redirectUrl.searchParams.set('orderId', tran_id);
        redirectUrl.searchParams.set('clearCart', 'true');
        return NextResponse.redirect(redirectUrl, 303);
    }

    return NextResponse.redirect(new URL('/checkout/failed', baseUrl), 303);
}