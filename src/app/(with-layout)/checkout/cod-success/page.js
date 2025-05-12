'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

export default function CodSuccessPage() {
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (orderId) {
            axios.get(`/api/products/orders?orderId=${orderId}`)
                .then(response => {
                    if (response.data) {
                        setOrder(response.data);
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
                <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        );
    }

    const { customerInfo, products, total, discount = 0, shippingCharge = 0 } = order;
    const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Format date as DD-MM-YYYY HH:MM
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Thank you, {customerInfo.name}!</h1>
                    <p className="text-xl text-gray-300">Your Order has been received</p>
                    <p className="text-gray-400 mt-2">We will call you to confirm your order as soon as possible.</p>
                    <p className="text-gray-400 mt-2">
                        If you have any questions about your order or shipping, feel free to contact us at{' '}
                        <a href="tel:+880123456789" className="text-blue-500 hover:underline">+880123456789</a>.
                    </p>
                </div>

                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-xl">
                    <h2 className="text-2xl font-semibold text-white mb-6 pb-4 border-b border-gray-700">
                        Order Details
                    </h2>
                    <div className="space-y-4 text-gray-300">
                        <p><strong>Order ID:</strong> {order.orderId}</p>
                        <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                        <p><strong>Total:</strong> ৳{total.toLocaleString()}</p>
                        <p><strong>Payment Method:</strong> Cash on Delivery</p>
                        <p><strong>Shipping Area:</strong> {customerInfo.city}</p>
                        <p><strong>Shipping Address:</strong> {customerInfo.address}, {customerInfo.thana}, {customerInfo.district}, {customerInfo.city}, {customerInfo.postcode}, {customerInfo.country}</p>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Ordered Items</h3>
                        {products.map((product, index) => (
                            <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-700">
                                {product.mainImage && (
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                        <Image
                                            src={product.mainImage}
                                            alt={product.title}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                )}
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