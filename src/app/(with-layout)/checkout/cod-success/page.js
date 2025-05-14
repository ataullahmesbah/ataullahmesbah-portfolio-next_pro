'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

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
                if (response.data) {
                    setOrder(response.data);
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <Toaster position="top-right" />
            <div className="max-w-3xl w-full">
                <div className="bg-gray-850/90 border border-gray-600 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-md animate-in">
                    {loading ? (
                        <div className="text-center py-12">
                            <svg
                                className="animate-spin h-8 w-8 text-blue-400 mx-auto"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            <p className="text-gray-400 mt-4 text-sm sm:text-base">Loading order details...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-400 text-lg sm:text-xl">{error}</p>
                            <a
                                href="/"
                                className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
                            >
                                Back to Home
                            </a>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-amber-300 mb-2 tracking-tight">
                                Thanks, {order.customerInfo.name}!
                            </h1>
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-500 rounded-full p-2 sm:p-3 animate-pulse">
                                    <svg
                                        className="h-8 w-8 sm:h-10 sm:w-10 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Order Confirmed!</h2>
                            <p className="text-gray-200 text-sm sm:text-base mb-4">
                                Your order <span className="text-blue-400">{orderId}</span> has been successfully placed.
                            </p>
                            <p className="text-gray-300 text-sm sm:text-base mb-6">
                                Payment Method: <span className="font-medium">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                                <br />
                                Expected Delivery:{' '}
                                {order.paymentMethod === 'cod'
                                    ? '3-7 working days'
                                    : '4-7 working days'}
                            </p>

                            <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 mb-6 border border-gray-700">
                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Order Summary</h3>
                                <div className="space-y-3">
                                    {order?.products?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between text-sm sm:text-base text-gray-200"
                                        >
                                            <span className="text-left">{item.title} (x{item.quantity})</span>
                                            <span>৳{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-gray-600 pt-3 mt-3">
                                        <div className="flex justify-between text-sm sm:text-base text-gray-200">
                                            <span>Subtotal</span>
                                            <span>
                                                ৳
                                                {(order?.products?.reduce(
                                                    (sum, item) => sum + item.price * item.quantity,
                                                    0
                                                ) || 0).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm sm:text-base text-gray-200">
                                            <span>Shipping Charge</span>
                                            <span>৳{(order?.shippingCharge || 0).toLocaleString()}</span>
                                        </div>
                                        {order?.discount > 0 && (
                                            <div className="flex justify-between text-sm sm:text-base text-gray-200">
                                                <span>Discount ({order?.couponCode})</span>
                                                <span>-৳{(order?.discount || 0).toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm sm:text-base text-gray-200">
                                            <span>Other Charge</span>
                                            <span>৳{(order?.otherCharge || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-base sm:text-lg font-bold text-green-400 mt-2">
                                            <span>Total</span>
                                            <span>৳{(order?.total || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 mb-6 border border-gray-700">
                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Shipping Information</h3>
                                <div className="text-sm sm:text-base text-gray-200 space-y-2">
                                    <p>
                                        <span className="font-medium">Name:</span> {order?.customerInfo?.name}
                                    </p>
                                    <p>
                                        <span className="font-medium">Email:</span> {order?.customerInfo?.email}
                                    </p>
                                    <p>
                                        <span className="font-medium">Phone:</span> {order?.customerInfo?.phone}
                                    </p>
                                    <p>
                                        <span className="font-medium">Address:</span>{' '}
                                        {order?.customerInfo?.address}, {order?.customerInfo?.city},{' '}
                                        {order?.customerInfo?.postcode}, {order?.customerInfo?.country}
                                    </p>
                                    {order?.customerInfo?.district && (
                                        <p>
                                            <span className="font-medium">District:</span>{' '}
                                            {order?.customerInfo?.district}
                                        </p>
                                    )}
                                    {order?.customerInfo?.thana && (
                                        <p>
                                            <span className="font-medium">Thana:</span> {order?.customerInfo?.thana}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/shop"
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm sm:text-base"
                                >
                                    Continue Shopping
                                </a>
                                <a
                                    href="/orders"
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
                                >
                                    View All Orders
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}