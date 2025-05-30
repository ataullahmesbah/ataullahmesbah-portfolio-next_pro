'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RejectedOrdersMod() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/products/orders');
                setOrders(response.data.filter((order) => order.status === 'rejected'));
            } catch (error) {
                console.error('Error fetching rejected orders:', error);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Rejected Orders</h1>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}