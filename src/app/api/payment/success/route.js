import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const paymentData = Object.fromEntries(formData);
        
       

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
                // Update order status
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
                } else {
                    console.error('❌ Failed to update order status');
                }
            } catch (updateError) {
                console.error('❌ Order update error:', updateError);
            }

            // ✅ FIX: Use proper URL format for redirect
            const successUrl = new URL('/checkout/success', process.env.NEXT_PUBLIC_BASE_URL);
            successUrl.searchParams.set('orderId', tran_id);
            successUrl.searchParams.set('payment', 'success');

            return NextResponse.redirect(successUrl.toString());
            
        } else {
            console.log('❌ Payment failed for order:', tran_id);
            
            const failUrl = new URL('/checkout/failed', process.env.NEXT_PUBLIC_BASE_URL);
            failUrl.searchParams.set('orderId', tran_id);
            failUrl.searchParams.set('reason', 'payment_failed');

            return NextResponse.redirect(failUrl.toString());
        }

    } catch (error) {
        console.error('❌ Payment success processing error:', error);
        
        const errorUrl = new URL('/checkout/error', process.env.NEXT_PUBLIC_BASE_URL);
        errorUrl.searchParams.set('message', 'payment_processing_error');

        return NextResponse.redirect(errorUrl.toString());
    }
}

// Handle GET requests (direct browser access)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const tran_id = searchParams.get('tran_id');
        const status = searchParams.get('status');

        if (tran_id && status === 'VALID') {
            const successUrl = new URL('/checkout/success', process.env.NEXT_PUBLIC_BASE_URL);
            successUrl.searchParams.set('orderId', tran_id);
            
            return NextResponse.redirect(successUrl.toString());
        }

        // Default redirect
        return NextResponse.redirect(new URL('/checkout/success', process.env.NEXT_PUBLIC_BASE_URL).toString());
        
    } catch (error) {
        console.error('GET redirect error:', error);
        return NextResponse.redirect(new URL('/checkout/success', process.env.NEXT_PUBLIC_BASE_URL).toString());
    }
}