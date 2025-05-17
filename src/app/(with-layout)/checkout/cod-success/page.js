'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaCircleCheck } from "react-icons/fa6";

export default function CodSuccess() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!orderId) {
                    setError('No order ID provided.');
                    setLoading(false);
                    return;
                }
                const response = await axios.get(`/api/products/orders?orderId=${orderId}`);
                if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                    setOrder(response.data[0]);
                    toast.success('Order confirmed! Thank you for your purchase.', {
                        duration: 5000,
                        style: { background: '#1f2937', color: '#fff' },
                    });
                } else {
                    setError('Order not found.');
                }
            } catch (err) {
                setError('Failed to fetch order details.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const formatOrderDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    if (loading || !orderId) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
                <Toaster position="top-right" />
                <div className="text-center animate-pulse">
                    <svg className="h-10 w-10 text-purple-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <p className="text-gray-300 mt-4">Loading your order...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
                <Toaster position="top-right" />
                <div className="text-center">
                    <p className="text-red-500 text-lg font-semibold">{error}</p>
                    <a href="/" className="mt-6 inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition">Go Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 border-b border-b-gray-800">
            <Toaster position="top-right" />
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-800 to-gray-700 border border-purple-500 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                    <p className="text-green-400 text-2xl flex justify-center items-center py-3">
                        <FaCircleCheck />
                    </p>
                    <h1 className="text-3xl font-extrabold text-purple-400 mb-2">Thanks, {order.customerInfo.name}!</h1>
                    <h2 className="text-xl font-semibold text-white mb-2">Your Order is Confirmed</h2>
                    <p className="text-sm text-gray-300 mb-1">Order ID: <span className="text-purple-400">{orderId}</span></p>
                    <p className="text-sm text-gray-400">Placed on: {formatOrderDate(order.createdAt)}</p>
                </div>

                <div className="bg-gray-800 border border-purple-600 rounded-xl p-6 mb-6 shadow-lg">
                    <h3 className="text-white font-bold text-lg mb-4">🧾 Order Summary</h3>
                    <div className="space-y-2">
                        {order.products.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-300">
                                <span>{item.title} (x{item.quantity})</span>
                                <span>৳{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                        <hr className="border-gray-600 my-3" />
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>Shipping Charge</span>
                            <span>৳{(order.shippingCharge || 0).toLocaleString()}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-sm text-red-400">
                                <span>Discount ({order.couponCode})</span>
                                <span>-৳{(order.discount).toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-base text-green-400 font-bold">
                            <span>Total</span>
                            <span>৳{order.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 border border-purple-600 rounded-xl p-6 mb-6 shadow-lg">
                    <h3 className="text-white font-bold text-lg mb-4">🚚 Shipping Details</h3>
                    <div className="text-sm text-gray-300 space-y-1">
                        <p><strong>Name:</strong> {order.customerInfo.name}</p>
                        <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                        <p><strong>Email:</strong> {order.customerInfo.email}</p>
                        <p><strong>Address:</strong> {order.customerInfo.address}, {order.customerInfo.city}, {order.customerInfo.postcode}, {order.customerInfo.country}</p>
                        {order.customerInfo.district && <p><strong>District:</strong> {order.customerInfo.district}</p>}
                        {order.customerInfo.thana && <p><strong>Thana:</strong> {order.customerInfo.thana}</p>}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/shop" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow transition text-sm">🛍️ Continue Shopping</a>
                    <a href="/orders" className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg shadow transition text-sm">📦 View My Orders</a>
                </div>
            </div>
        </div>
    );
}
