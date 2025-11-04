'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            // Fetch order details
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`/api/products/orders?orderId=${orderId}`);
            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    setOrder(data[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-white mt-4">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h1>
                    <p className="text-gray-300 text-lg">Thank you for your purchase</p>
                    {orderId && (
                        <p className="text-blue-400 mt-2">Order ID: {orderId}</p>
                    )}
                </div>

                {order && (
                    <div className="bg-gray-800 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                        <div className="space-y-2">
                            {order.products.map((product, index) => (
                                <div key={index} className="flex justify-between text-gray-300">
                                    <span>{product.title} (x{product.quantity})</span>
                                    <span>৳{(product.price * product.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="border-t border-gray-600 pt-2 mt-2">
                                <div className="flex justify-between text-white font-bold">
                                    <span>Total</span>
                                    <span>৳{order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-center space-y-4">
                    <Link
                        href="/shop"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                    <div>
                        <Link
                            href="/shop/track/orders"
                            className="text-blue-400 hover:text-blue-300 underline"
                        >
                            Track Your Order
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}