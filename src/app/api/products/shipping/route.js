import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Mock shipping charge (replace with database or logic)
        const charge = 100; // 100 BDT for COD
        console.log('Shipping Charge Returned:', charge); // Debug log
        return NextResponse.json({ charge }, { status: 200 });
    } catch (error) {
        console.error('Error fetching shipping charge:', error);
        return NextResponse.json({ error: 'Failed to fetch shipping charge' }, { status: 500 });
    }
}