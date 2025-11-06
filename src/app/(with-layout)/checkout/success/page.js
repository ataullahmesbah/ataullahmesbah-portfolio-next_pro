'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const payment = searchParams.get('payment');
    const clearCart = searchParams.get('clearCart');
    const [cartCleared, setCartCleared] = useState(false);

    useEffect(() => {
        // ✅ Clear cart if clearCart parameter is present
        if (clearCart === 'true' && !cartCleared) {
            console.log('🛒 Clearing cart...');
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdated'));
            setCartCleared(true);
        }
    }, [clearCart, cartCleared]);

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-white mb-4">
                    Payment Successful!
                </h1>

                <p className="text-gray-300 text-lg mb-6">
                    Thank you for your purchase. Your order has been confirmed.
                </p>

                {/* Order ID */}
                {orderId && (
                    <div className="bg-gray-800 rounded-lg p-4 mb-6">
                        <p className="text-gray-400 text-sm mb-1">Order ID</p>
                        <p className="text-blue-400 font-mono text-lg">{orderId}</p>
                        <p className="text-green-400 text-sm mt-2">Status: Confirmed</p>
                    </div>
                )}

                {/* Cart Cleared Message */}
                {cartCleared && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-6">
                        <p className="text-green-400 text-sm">
                            ✅ Your cart has been cleared
                        </p>
                    </div>
                )}

                {/* Action Buttons - Using window.location for navigation */}
                <div className="space-y-4">
                    <button
                        onClick={() => window.location.href = '/shop'}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </button>

                    <button
                        onClick={() => window.location.href = '/shop/track/orders'}
                        className="w-full sm:w-auto px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Track Your Order
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        You will receive an order confirmation email shortly.
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                        For any questions, contact our support team.
                    </p>
                </div>
            </div>
        </div>
    );
}