import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { productId, amount } = await request.json();

        // Process payment (your existing logic)
        // ...

        // Record affiliate purchase
        await fetch('http://localhost:3000/api/affiliate/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, amount }),
        });

        return NextResponse.json({ message: 'Purchase successful' }, { status: 201 });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ message: 'Failed to process purchase', error: error.message }, { status: 500 });
    }
}