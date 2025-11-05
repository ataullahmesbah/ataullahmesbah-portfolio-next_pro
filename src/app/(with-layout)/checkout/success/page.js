'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const payment = searchParams.get('payment');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        } else {
            setLoading(false);
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
        <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mb-6 shadow-2xl shadow-green-500/20">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-4">
                        Payment Successful!
                    </h1>

                    <p className="text-gray-300 text-lg mb-2">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>

                    {orderId && (
                        <p className="text-blue-400 font-mono text-sm sm:text-base">
                            Order ID: {orderId}
                        </p>
                    )}
                </div>

                {/* Order Summary */}
                {order && (
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 mb-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            {order.products.map((product, index) => (
                                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{product.title}</p>
                                        {product.size && (
                                            <p className="text-gray-400 text-sm">Size: {product.size}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-300 text-sm">
                                            ৳{product.price.toLocaleString()} × {product.quantity}
                                        </p>
                                        <p className="text-green-400 font-semibold">
                                            ৳{(product.price * product.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            <div className="border-t border-gray-600 pt-4 space-y-2">
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Discount</span>
                                        <span className="text-red-400">-৳{order.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                {order.shippingCharge > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Shipping</span>
                                        <span className="text-gray-300">৳{order.shippingCharge.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-600">
                                    <span className="text-white">Total Paid</span>
                                    <span className="text-green-400">৳{order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Method Info */}
                <div className="bg-gray-800/60 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 mb-6 shadow-xl">
                    <h2 className="text-xl font-semibold text-white mb-4">Payment Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-400">Payment Method</p>
                            <p className="text-white font-medium">Online Payment (bKash)</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Status</p>
                            <p className="text-green-400 font-medium">Paid & Confirmed</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Order Date</p>
                            <p className="text-white">
                                {order ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Delivery</p>
                            <p className="text-yellow-400">Processing</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="text-center space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            Continue Shopping
                        </Link>

                        <Link
                            href="/shop/track/orders"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Track Order
                        </Link>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">
                            A confirmation email has been sent to your email address.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}