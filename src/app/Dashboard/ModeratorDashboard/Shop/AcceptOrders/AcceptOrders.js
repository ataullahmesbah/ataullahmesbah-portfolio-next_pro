// src/app/moderator-dashboard/accepted-orders/page.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi'; // Added for search icon

export default function AcceptedOrdersMod() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // Added for search
    const [currentPage, setCurrentPage] = useState(1); // Added for pagination
    const ordersPerPage = 10; // Added for pagination

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/products/orders');
                const acceptedOrders = response.data.filter((order) => order.status === 'accepted');
                // Sort by orderId descending (latest first)
                acceptedOrders.sort((a, b) => b.orderId - a.orderId);
                setOrders(acceptedOrders);
                setFilteredOrders(acceptedOrders);
            } catch (error) {
                console.error('Error fetching accepted orders:', error);
            }
        };
        fetchOrders();
    }, []);

    // Search functionality
    useEffect(() => {
        const filtered = orders.filter((order) =>
            order.orderId.toString().includes(searchQuery.toLowerCase().trim())
        );
        // Sort: matching order first, then by orderId descending
        filtered.sort((a, b) => {
            const aMatch = a.orderId.toString().includes(searchQuery.toLowerCase().trim());
            const bMatch = b.orderId.toString().includes(searchQuery.toLowerCase().trim());
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return b.orderId - a.orderId;
        });
        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset to first page on search
    }, [searchQuery, orders]);

    // Pagination Logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">Accepted Orders</h1>

                {/* Search Bar */}
                <div className="mb-6 flex justify-center">
                    <div className="relative w-full sm:w-64">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                        <input
                            type="text"
                            placeholder="Search by order number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-purple-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </div>
                </div>

                {currentOrders.length === 0 ? (
                    <p className="text-center text-purple-300 text-lg">No accepted orders found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="bg-gray-900 rounded-xl shadow-lg p-6">
                            <table className="w-full text-white">
                                <thead>
                                    <tr className="bg-gray-800 border-b border-gray-700">
                                        <th className="p-3 md:p-4 text-left text-purple-200">Order Number</th>
                                        <th className="p-3 md:p-4 text-left text-purple-200">Products</th>
                                        <th className="p-3 md:p-4 text-left text-purple-200">Quantity</th>
                                        <th className="p-3 md:p-4 text-left text-purple-200">Price</th>
                                        <th className="p-3 md:p-4 text-left text-purple-200">Payment Method</th>
                                        <th className="p-3 md:p-4 text-left text-purple-200">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrders.map((order) => (
                                        <tr key={order.orderId} className="border-b border-gray-700 hover:bg-gray-800">
                                            <td className="p-3 md:p-4 text-purple-300">{order.orderId}</td>
                                            <td className="p-3 md:p-4 text-white">
                                                {order.products.map((p) => p.title).join(', ')}
                                            </td>
                                            <td className="p-3 md:p-4 text-purple-300">
                                                {order.products.reduce((sum, p) => sum + p.quantity, 0)}
                                            </td>
                                            <td className="p-3 md:p-4 text-purple-300">৳{order.total.toLocaleString()}</td>
                                            <td className="p-3 md:p-4 text-purple-300">{order.paymentMethod === 'cod' ? 'COD' : 'Pay First'}</td>
                                            <td className="p-3 md:p-4 text-purple-300">{order.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 space-x-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 disabled:opacity-50 transition-all duration-300"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-purple-200 hover:bg-gray-600'} transition-all duration-300`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 disabled:opacity-50 transition-all duration-300"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}