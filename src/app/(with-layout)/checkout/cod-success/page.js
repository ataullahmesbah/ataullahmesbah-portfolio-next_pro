'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function CodSuccessPage() {
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (orderId) {
            axios.get('/api/products/orders')
                .then(response => {
                    const foundOrder = response.data.find(o => o.orderId === orderId);
                    if (foundOrder) {
                        setOrder(foundOrder);
                    } else {
                        setError('Order not found.');
                    }
                })
                .catch(err => {
                    console.error('Error fetching order:', err);
                    setError('Failed to load order details.');
                });
        } else {
            setError('Invalid order ID.');
        }
    }, [orderId]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-red-600/90 text-white p-4 rounded-lg text-center">
                    {error}
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    const { customerInfo, products, total, discount = 0, shippingCharge = 0 } = order;
    const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Thank you, {customerInfo.name}!</h1>
                    <p className="text-xl text-gray-300">Your Order has been received</p>
                    <p className="text-gray-400 mt-2">We will call you to confirm order as soon as possible.</p>
                    <p className="text-gray-400 mt-2">
                        If you have any questions about order or shipping, feel free to let us know at{' '}
                        <a href="tel:+880123456789" className="text-blue-500 hover:underline">+880123456789</a>.
                    </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-xl">
                    <h2 className="text-2xl font-semibold text-white mb-6 pb-4 border-b border-gray-700">
                        Order Details
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <p><strong>Order ID:</strong> {order.orderId}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total:</strong> ৳{total.toLocaleString()}</p>
                        <p><strong>Payment Method:</strong> Cash on Delivery</p>
                        <p><strong>Shipping Area:</strong> {customerInfo.city}</p>
                        <p><strong>Shipping Address:</strong> {customerInfo.address}, {customerInfo.city}, {customerInfo.postcode}, {customerInfo.country}</p>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Ordered Items</h3>
                        {products.map((product, index) => (
                            <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-700">
                                <div className="flex-1">
                                    <h4 className="text-lg font-medium text-white">{product.title}</h4>
                                    <p className="text-gray-400">Size: None</p>
                                    <p className="text-gray-400">
                                        {product.quantity} x ৳{product.price.toLocaleString()}
                                    </p>
                                </div>
                                <div className="ml-auto text-lg font-medium text-white">
                                    ৳{(product.price * product.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-lg text-gray-400">
                            <span>Subtotal</span>
                            <span>৳{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg text-gray-400">
                            <span>Shipping</span>
                            <span>৳{(shippingCharge || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg text-gray-400">
                            <span>Discount</span>
                            <span>৳{(discount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg text-gray-400">
                            <span>VAT</span>
                            <span>৳0</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-700">
                            <span>Total</span>
                            <span>৳{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link
                        href="/shop"
                        className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}