'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Toaster, toast } from 'react-hot-toast';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCustomerInfo, setShowCustomerInfo] = useState(false);
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [stats, setStats] = useState({ pending: 0, accepted: 0, rejected: 0, monthly: 0 });
    const [loading, setLoading] = useState(false);
    const [validatingOrder, setValidatingOrder] = useState(null);
    const ordersPerPage = 10;
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders(orders, activeTab, searchTerm, selectedDate);
    }, [activeTab, searchTerm, selectedDate, orders]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/products/orders');
            const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
            updateStats(sortedOrders);
            filterOrders(sortedOrders, activeTab, searchTerm, selectedDate);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

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
            filtered = filtered.filter(o =>
                o.orderId.toLowerCase().includes(search.toLowerCase()) ||
                o.customerInfo.name.toLowerCase().includes(search.toLowerCase()) ||
                o.customerInfo.phone.includes(search)
            );
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
        setCurrentPage(1);
    };

    const validateOrderProducts = async (order) => {
        try {
            setValidatingOrder(order.orderId);
            const response = await axios.post('/api/products/orders/validate-products', {
                orderId: order.orderId,
                products: order.products
            });

            return response.data;
        } catch (error) {
            console.error('Error validating order products:', error);

            if (error.response?.data?.error) {
                toast.error(error.response.data.error, {
                    duration: 5000,
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 'bold'
                    }
                });
                return { isValid: false, issues: [error.response.data.error] };
            } else {
                toast.error('Failed to validate products. Please try again.', {
                    duration: 3000,
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 'bold'
                    }
                });
                return { isValid: false, issues: ['Validation error. Please try again.'] };
            }
        } finally {
            setValidatingOrder(null);
        }
    };

    const handleAction = async (orderId, action) => {
        try {
            const order = orders.find(o => o.orderId === orderId);

            if (action === 'accept') {
                // Validate products before accepting
                const validation = await validateOrderProducts(order);

                if (!validation.isValid) {
                    validation.issues.forEach(issue => {
                        toast.error(issue, {
                            duration: 5000,
                            style: {
                                background: '#ef4444',
                                color: '#fff',
                                fontWeight: 'bold'
                            }
                        });
                    });
                    return;
                }
            }

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

                // Show success toast
                toast.success(`Order ${action === 'accept' ? 'accepted' : 'rejected'} successfully!`, {
                    duration: 3000,
                    style: {
                        background: action === 'accept' ? '#10b981' : '#ef4444',
                        color: '#fff',
                        fontWeight: 'bold'
                    }
                });
            }
        } catch (error) {
            console.error(`Error performing ${action} on order:`, error);

            // Show specific error messages based on the error response
            if (error.response?.data?.error) {
                toast.error(error.response.data.error, {
                    duration: 5000,
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 'bold'
                    }
                });
            } else {
                toast.error(`Failed to ${action} order. Please try again.`, {
                    duration: 3000,
                    style: {
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 'bold'
                    }
                });
            }
        }
    };

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatSize = (size) => {
        if (!size || typeof size !== 'string' || size.trim() === '') {
            return 'N/A';
        }
        return size.charAt(0).toUpperCase() + size.slice(1).toLowerCase();
    };


    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            {/* Toast container */}
            {/* Toast Container */}

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'linear-gradient(135deg, #363636, #4b4b4b)',
                        color: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                        padding: '12px 16px',
                        fontWeight: 500,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                    success: {
                        duration: 3000,
                        style: {
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: '1px solid rgba(16, 185, 129, 0.5)',
                        },
                        icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ),
                    },
                    error: {
                        duration: 5000,
                        style: {
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                        },
                        icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ),
                    },
                }}
            />
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
                        placeholder="Search by Order ID, Name, or Phone"
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
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </>
                        ) : (
                            'Refresh'
                        )}
                    </button>
                </div>

                {/* Orders Table */}
                <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            <table className="w-full text-white min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="py-3 text-left text-sm sm:text-base">Order ID</th>
                                        <th className="py-3 text-left text-sm sm:text-base">Customer</th>
                                        <th className="py-3 text-left text-sm sm:text-base">Products</th>
                                        <th className="py-3 text-left text-sm sm:text-base">Total</th>
                                        <th className="py-3 text-left text-sm sm:text-base">Payment</th>
                                        <th className="py-3 text-left text-sm sm:text-base">Date</th>
                                        <th className="py-3 text-left text-sm sm:text-base">Status</th>
                                        <th className="py-3 text-left text-sm sm:text-base">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="py-8 text-center text-gray-400">
                                                No orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedOrders.map((order) => (
                                            <tr key={order.orderId} className="border-b border-gray-700 hover:bg-gray-750">
                                                <td className="py-4 text-sm font-mono">{order.orderId}</td>
                                                <td className="py-4">
                                                    <div>
                                                        <div className="font-medium">{order.customerInfo.name}</div>
                                                        <div className="text-gray-400 text-sm">{order.customerInfo.phone}</div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="max-w-xs">
                                                        {order.products.map((product, index) => (
                                                            <div key={index} className="mb-2 last:mb-0">
                                                                <div className="font-medium">{product.title}</div>
                                                                <div className="text-gray-400 text-sm">
                                                                    Qty: {product.quantity} × ৳{product.price.toLocaleString()}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="py-4 font-bold">৳{order.total.toLocaleString()}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${order.paymentMethod === 'cod'
                                                        ? 'bg-yellow-500/20 text-yellow-400'
                                                        : 'bg-green-500/20 text-green-400'
                                                        }`}>
                                                        {order.paymentMethod === 'cod' ? 'COD' : 'Prepaid'}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-sm text-gray-400">{formatDate(order.createdAt)}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'pending' || order.status === 'pending_payment'
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : order.status === 'accepted'
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {order.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setShowCustomerInfo(true);
                                                            }}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs"
                                                        >
                                                            Details
                                                        </button>
                                                        {(order.status === 'pending' || order.status === 'pending_payment') && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleAction(order.orderId, 'accept')}
                                                                    disabled={validatingOrder === order.orderId}
                                                                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs disabled:opacity-50"
                                                                >
                                                                    {validatingOrder === order.orderId ? 'Checking...' : 'Accept'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleAction(order.orderId, 'reject')}
                                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex flex-wrap justify-between items-center mt-6 gap-2">
                                    <div className="text-gray-400 text-sm">
                                        Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50 text-sm"
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`px-3 py-1 rounded-lg text-sm ${currentPage === pageNum
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50 text-sm"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Customer Info Modal */}
                {showCustomerInfo && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Order Details - {selectedOrder.orderId}</h2>
                                <button
                                    onClick={() => setShowCustomerInfo(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                {/* Divider for Desktop */}
                                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-600"></div>
                                {/* Divider for Mobile */}
                                <div className="md:hidden my-6 border-t border-gray-600"></div>

                                {/* Customer Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
                                    <div className="space-y-3 text-gray-300">
                                        <p><strong>Name:</strong> {selectedOrder.customerInfo.name}</p>
                                        <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
                                        <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                                        <p><strong>Address:</strong> {selectedOrder.customerInfo.address}</p>
                                        <p><strong>City:</strong> {selectedOrder.customerInfo.city || 'N/A'}</p>
                                        <p><strong>Postcode:</strong> {selectedOrder.customerInfo.postcode || 'N/A'}</p>
                                        <p><strong>Country:</strong> {selectedOrder.customerInfo.country}</p>
                                        {selectedOrder.customerInfo.district && (
                                            <p><strong>District:</strong> {selectedOrder.customerInfo.district}</p>
                                        )}
                                        {selectedOrder.customerInfo.thana && (
                                            <p><strong>Thana:</strong> {selectedOrder.customerInfo.thana}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Order Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Order Information</h3>
                                    <div className="space-y-3 text-gray-300">
                                        <p><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                                        <p><strong>Status:</strong>
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedOrder.status === 'pending' || selectedOrder.status === 'pending_payment'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : selectedOrder.status === 'accepted'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {selectedOrder.status.replace('_', ' ')}
                                            </span>
                                        </p>
                                        <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'}</p>
                                        {selectedOrder.couponCode && (
                                            <p><strong>Coupon Code:</strong> {selectedOrder.couponCode}</p>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-semibold text-white mt-6 mb-4">Products</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.products.map((product, index) => (
                                            <div key={index} className="bg-gray-750 rounded-lg p-3">
                                                <div className="font-medium">{product.title}</div>
                                                <div className="text-sm text-gray-400">
                                                    Quantity: {product.quantity} × ৳{product.price.toLocaleString()} = ৳{(product.quantity * product.price).toLocaleString()}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    Size: {formatSize(product.size)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-700">
                                        <div className="flex justify-between text-lg font-bold text-white">
                                            <span>Total:</span>
                                            <span>৳{selectedOrder.total.toLocaleString()}</span>
                                        </div>
                                        {selectedOrder.discount > 0 && (
                                            <div className="flex justify-between text-green-400">
                                                <span>Discount:</span>
                                                <span>-৳{selectedOrder.discount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {selectedOrder.shippingCharge > 0 && (
                                            <div className="flex justify-between text-gray-400">
                                                <span>Shipping:</span>
                                                <span>৳{selectedOrder.shippingCharge.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                .animate-toast-in {
                    animation: slideIn 0.3s ease-out;
                }
                .animate-toast-out {
                    animation: fadeOut 0.3s ease-in;
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes fadeOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}