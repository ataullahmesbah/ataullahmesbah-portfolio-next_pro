import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const paymentData = Object.fromEntries(formData);

        console.log('✅ Payment Success Data:', paymentData);

        const {
            tran_id,
            status,
            val_id,
            amount,
            bank_tran_id,
            card_type
        } = paymentData;

        // Validate payment
        if (status === 'VALID' || status === 'VALIDATED') {
            console.log('✅ Payment validated for order:', tran_id);

            try {
                // Update order status to 'accepted'
                const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/orders/update-status`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        orderId: tran_id,
                        status: 'accepted',
                        paymentDetails: {
                            paymentStatus: 'paid',
                            paymentMethod: 'online',
                            transactionId: val_id,
                            bankTransactionId: bank_tran_id,
                            amount: amount,
                            cardType: card_type
                        }
                    }),
                });

                if (updateResponse.ok) {
                    console.log('✅ Order status updated successfully');

                    // ✅ FIX: Clear cart from localStorage
                    // This will clear the cart for the user
                    // Note: This happens on the client side after redirect
                } else {
                    console.log('⚠️ Order status update failed, but payment was successful');
                }
            } catch (updateError) {
                console.error('❌ Order update error:', updateError);
            }

            // ✅ FIX: Use simple redirect
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            const redirectUrl = `${baseUrl}/checkout/success?orderId=${tran_id}&payment=success&clearCart=true`;

            console.log('🔗 Redirecting to:', redirectUrl);
            return NextResponse.redirect(redirectUrl);

        } else {
            console.log('❌ Payment failed for order:', tran_id);

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            const redirectUrl = `${baseUrl}/checkout/failed?orderId=${tran_id}&reason=payment_failed`;

            return NextResponse.redirect(redirectUrl);
        }

    } catch (error) {
        console.error('❌ Payment success processing error:', error);

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const redirectUrl = `${baseUrl}/checkout/error?message=payment_processing_error`;

        return NextResponse.redirect(redirectUrl);
    }
}

// Handle GET requests
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const tran_id = searchParams.get('tran_id');
        const status = searchParams.get('status');

        if (tran_id && status === 'VALID') {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            const redirectUrl = `${baseUrl}/checkout/success?orderId=${tran_id}&clearCart=true`;

            return NextResponse.redirect(redirectUrl);
        }

        // Default redirect
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        return NextResponse.redirect(`${baseUrl}/checkout/success`);

    } catch (error) {
        console.error('GET redirect error:', error);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        return NextResponse.redirect(`${baseUrl}/checkout/success`);
    }
}