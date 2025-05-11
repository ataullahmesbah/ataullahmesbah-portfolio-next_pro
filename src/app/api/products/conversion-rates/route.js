import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Mock data (replace with database or external API)
        const conversionRates = {
            USD: 123, // 1 USD = 123 BDT
            EUR: 135, // 1 EUR = 135 BDT
            BDT: 1,
        };
        return NextResponse.json(conversionRates, { status: 200 });
    } catch (error) {
        console.error('Error fetching conversion rates:', error);
        return NextResponse.json({ error: 'Failed to fetch conversion rates' }, { status: 500 });
    }
}