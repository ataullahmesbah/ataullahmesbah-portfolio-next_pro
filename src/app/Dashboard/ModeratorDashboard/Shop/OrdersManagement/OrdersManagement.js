'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function OrdersManagement() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCustomerInfo, setShowCustomerInfo] = useState(false);
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [stats, setStats] = useState({ pending: 0, accepted: 0, rejected: 0, monthly: 0 });
    const ordersPerPage = 10;
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/products/orders');
                const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOrders(sortedOrders);
                updateStats(sortedOrders);
                filterOrders(sortedOrders, activeTab, searchTerm, selectedDate);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders(orders, activeTab, searchTerm, selectedDate);
    }, [activeTab, searchTerm, selectedDate, orders]);

    const updateStats = (orders) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const stats = {
            pending: orders.filter(o => o.status === 'pending' || o.status === 'pending_payment').length,
            accepted: orders.filter(o => o.status === 'accepted').length,
            rejected: orders.filter(o => o.status === 'rejected').length,
            monthly: orders.filter(o => {
                const orderDate = new Date(o.createdAt);
                return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
            }).length,
        };
        setStats(stats);
    };

    const filterOrders = (orders, tab, search, date) => {
        let filtered = orders;
        if (tab === 'pending') {
            filtered = filtered.filter(o => o.status === 'pending' || o.status === 'pending_payment');
        } else if (tab === 'accepted') {
            filtered = filtered.filter(o => o.status === 'accepted');
        } else if (tab === 'rejected') {
            filtered = filtered.filter(o => o.status === 'rejected');
        }
        if (search) {
            filtered = filtered.filter(o => o.orderId.toLowerCase().includes(search.toLowerCase()));
        }
        if (date) {
            filtered = filtered.filter(o => {
                const orderDate = new Date(o.createdAt);
                return (
                    orderDate.getDate() === date.getDate() &&
                    orderDate.getMonth() === date.getMonth() &&
                    orderDate.getFullYear() === date.getFullYear()
                );
            });
        }
        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    };

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
                updateStats(orders);
                filterOrders(orders, activeTab, searchTerm, selectedDate);
            }
        } catch (error) {
            console.error(`Error performing ${action} on order:`, error);
        }
    };

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Order Management</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <p className="text-gray-300 text-sm">Pending Orders</p>
                        <p className="text-2xl font-bold text-blue-400">{stats.pending}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <p className="text-gray-300 text-sm">Accepted Orders</p>
                        <p className="text-2xl font-bold text-green-400">{stats.accepted}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <p className="text-gray-300 text-sm">Rejected Orders</p>
                        <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                        <p className="text-gray-300 text-sm">This Monthly Order</p>
                        <p className="text-2xl font-bold text-purple-400">{stats.monthly}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-700 mb-6">
                    <button
                        className={`px-4 py-2 text-sm sm:text-base font-medium ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`px-4 py-2 text-sm sm:text-base font-medium ${activeTab === 'accepted' ? 'border-b-2 border-green-500 text-green-400' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('accepted')}
                    >
                        Accepted
                    </button>
                    <button
                        className={`px-4 py-2 text-sm sm:text-base font-medium ${activeTab === 'rejected' ? 'border-b-2 border-red-500 text-red-400' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('rejected')}
                    >
                        Rejected
                    </button>
                </div>

                {/* Search and Date Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search by Order Number"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        placeholderText="Select Date"
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        isClearable
                    />
                </div>

                {/* Orders Table */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 overflow-x-auto">
                    <table className="w-full text-white min-w-[640px]">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="py-3 text-left text-sm sm:text-base">Serial</th>
                                <th className="py-3 text-left text-sm sm:text-base">Order Number</th>
                                <th className="py-3 text-left text-sm sm:text-base">Products</th>
                                <th className="py-3 text-left text-sm sm:text-base">Quantity</th>
                                <th className="py-3 text-left text-sm sm:text-base">Price</th>
                                <th className="py-3 text-left text-sm sm:text-base">Payment</th>
                                <th className="py-3 text-left text-sm sm:text-base">Status</th>
                                <th className="py-3 text-left text-sm sm:text-base">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-4 text-center text-gray-400">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                paginatedOrders.map((order, index) => (
                                    <tr key={order.orderId} className="border-b border-gray-700">
                                        <td className="py-3 text-sm sm:text-base">
                                            {(currentPage - 1) * ordersPerPage + index + 1}
                                        </td>
                                        <td className="py-3 text-sm sm:text-base">{order.orderId}</td>
                                        <td className="py-3 text-sm sm:text-base">
                                            {order.products.map((p) => p.title).join(', ')}
                                        </td>
                                        <td className="py-3 text-sm sm:text-base">
                                            {order.products.reduce((sum, p) => sum + p.quantity, 0)}
                                        </td>
                                        <td className="py-3 text-sm sm:text-base">৳{order.total.toLocaleString()}</td>
                                        <td className="py-3 text-sm sm:text-base">
                                            {order.paymentMethod === 'cod' ? 'COD' : 'Pay First'}
                                        </td>
                                        <td className="py-3 text-sm sm:text-base">{order.status}</td>
                                        <td className="py-3 flex flex-wrap gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowCustomerInfo(true);
                                                }}
                                                className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm"
                                            >
                                                Info
                                            </button>
                                            {(order.status === 'pending' || order.status === 'pending_payment') && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(order.orderId, 'accept')}
                                                        className="px-2 sm:px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(order.orderId, 'reject')}
                                                        className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {(order.status === 'accepted' || order.status === 'rejected') && (
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/admin/shop/${order.status === 'accepted' ? 'accepted-orders' : 'rejected-orders'}`
                                                        )
                                                    }
                                                    className="px-2 sm:px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xs sm:text-sm"
                                                >
                                                    View
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50 text-sm sm:text-base"
                            >
                                Previous
                            </button>
                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded-lg text-sm sm:text-base ${currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 text-white hover:bg-gray-600'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50 text-sm sm:text-base"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Customer Info Modal */}
                {showCustomerInfo && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl p-6 sm:p-8 max-w-md w-full">
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Customer Information</h2>
                            <div className="space-y-3 text-gray-300 text-sm sm:text-base">
                                <p><strong>Name:</strong> {selectedOrder.customerInfo.name}</p>
                                <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
                                <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                                <p><strong>Address:</strong> {selectedOrder.customerInfo.address}</p>
                                <p><strong>City:</strong> {selectedOrder.customerInfo.city || 'N/A'}</p>
                                <p><strong>Postcode:</strong> {selectedOrder.customerInfo.postcode || 'N/A'}</p>
                                <p><strong>Country:</strong> {selectedOrder.customerInfo.country}</p>
                                <h3 className="text-base sm:text-lg font-semibold text-white mt-4">Order Summary</h3>
                                <p><strong>Order Number:</strong> {selectedOrder.orderId}</p>
                                <p><strong>Products:</strong> {selectedOrder.products.map((p) => p.title).join(', ')}</p>
                                <p><strong>Quantity:</strong> {selectedOrder.products.reduce((sum, p) => sum + p.quantity, 0)}</p>
                                <p><strong>Total:</strong> ৳{selectedOrder.total.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => setShowCustomerInfo(false)}
                                className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
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