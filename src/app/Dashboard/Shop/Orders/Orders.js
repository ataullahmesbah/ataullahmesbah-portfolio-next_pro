'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCustomerInfo, setShowCustomerInfo] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/products/orders');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    const handleAction = async (orderId, action) => {
        try {
            const response = await axios.post('/api/products/orders/action', { orderId, action });
            if (response.data.success) {
                setOrders((prev) =>
                    prev.map((o) =>
                        o.orderId === orderId
                            ? { ...o, status: action === 'accept' ? 'accepted' : 'rejected' }
                            : o
                    )
                );
            }
        } catch (error) {
            console.error(`Error performing ${action} on order:`, error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">All Orders</h1>
                <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                    <table className="w-full text-white">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="py-3 text-left">Order Number</th>
                                <th className="py-3 text-left">Products</th>
                                <th className="py-3 text-left">Quantity</th>
                                <th className="py-3 text-left">Price</th>
                                <th className="py-3 text-left">Payment Method</th>
                                <th className="py-3 text-left">Status</th>
                                <th className="py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.orderId} className="border-b border-gray-700">
                                    <td className="py-3">{order.orderId}</td>
                                    <td className="py-3">
                                        {order.products.map((p) => p.title).join(', ')}
                                    </td>
                                    <td className="py-3">
                                        {order.products.reduce((sum, p) => sum + p.quantity, 0)}
                                    </td>
                                    <td className="py-3">৳{order.total.toLocaleString()}</td>
                                    <td className="py-3">{order.paymentMethod === 'cod' ? 'COD' : 'Pay First'}</td>
                                    <td className="py-3">{order.status}</td>
                                    <td className="py-3">
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setShowCustomerInfo(true);
                                            }}
                                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
                                        >
                                            Customer Info
                                        </button>
                                        {order.status === 'pending' || order.status === 'pending_payment' ? (
                                            <>
                                                <button
                                                    onClick={() => handleAction(order.orderId, 'accept')}
                                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAction(order.orderId, 'reject')}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `/admin/shop/${order.status === 'accepted' ? 'accepted-orders' : 'rejected-orders'}`
                                                    )
                                                }
                                                className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                            >
                                                View
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showCustomerInfo && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-white mb-6">Customer Information</h2>
                            <div className="space-y-3 text-gray-300">
                                <p><strong>Name:</strong> {selectedOrder.customerInfo.name}</p>
                                <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
                                <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                                <p><strong>Address:</strong> {selectedOrder.customerInfo.address}</p>
                                <p><strong>City:</strong> {selectedOrder.customerInfo.city}</p>
                                <p><strong>Postcode:</strong> {selectedOrder.customerInfo.postcode}</p>
                                <p><strong>Country:</strong> {selectedOrder.customerInfo.country}</p>
                                <h3 className="text-lg font-semibold text-white mt-4">Order Summary</h3>
                                <p><strong>Order Number:</strong> {selectedOrder.orderId}</p>
                                <p><strong>Products:</strong> {selectedOrder.products.map((p) => p.title).join(', ')}</p>
                                <p><strong>Quantity:</strong> {selectedOrder.products.reduce((sum, p) => sum + p.quantity, 0)}</p>
                                <p><strong>Total:</strong> ৳{selectedOrder.total.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => setShowCustomerInfo(false)}
                                className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}