import { NextResponse } from 'next/server';
import Product from '@/models/Products';
import dbConnect from '@/lib/dbMongoose';


export async function POST(request) {
    await dbConnect();

    try {
        const { cartItems } = await request.json();

        if (!Array.isArray(cartItems)) {
            return NextResponse.json(
                { error: 'Invalid cart data' },
                { status: 400 }
            );
        }

        const validationResults = [];
        let isValid = true;
        let totalCartValue = 0;

        for (const item of cartItems) {
            const product = await Product.findById(item.productId);

            if (!product) {
                validationResults.push({
                    productId: item.productId,
                    valid: false,
                    message: 'Product not found'
                });
                isValid = false;
                continue;
            }

            // Check if product is available for purchase
            if (product.quantity <= 0 || product.productType === 'Affiliate') {
                validationResults.push({
                    productId: item.productId,
                    valid: false,
                    message: 'Product is not available for purchase'
                });
                isValid = false;
                continue;
            }

            // Check if requested quantity exceeds available stock
            if (item.quantity > product.quantity) {
                validationResults.push({
                    productId: item.productId,
                    valid: false,
                    message: `Only ${product.quantity} units available for ${product.title}`,
                    availableQuantity: product.quantity
                });
                isValid = false;
            }
            // Check if quantity exceeds maximum allowed per order (3)
            else if (item.quantity > 3) {
                validationResults.push({
                    productId: item.productId,
                    valid: false,
                    message: 'Maximum 3 units per product allowed',
                    availableQuantity: Math.min(product.quantity, 3)
                });
                isValid = false;
            }
            // Check for negative quantity
            else if (item.quantity < 1) {
                validationResults.push({
                    productId: item.productId,
                    valid: false,
                    message: 'Quantity must be at least 1',
                    availableQuantity: 1
                });
                isValid = false;
            }
            // Item is valid
            else {
                validationResults.push({
                    productId: item.productId,
                    valid: true,
                    availableQuantity: product.quantity,
                    price: product.prices.find(p => p.currency === 'BDT')?.amount || product.prices[0]?.amount
                });

                // Calculate item total for cart value
                const price = product.prices.find(p => p.currency === 'BDT')?.amount || product.prices[0]?.amount;
                totalCartValue += price * item.quantity;
            }
        }

        return NextResponse.json({
            isValid,
            results: validationResults,
            totalCartValue
        });

    } catch (error) {
        console.error('Cart validation error:', error);
        return NextResponse.json(
            { error: 'Failed to validate cart' },
            { status: 500 }
        );
    }
}