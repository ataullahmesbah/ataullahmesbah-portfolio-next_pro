"use client";
import { useState, useCallback, useRef } from "react";
import { FaSearch, FaDownload, FaShoppingBag, FaUser, FaMapMarkerAlt, FaCreditCard, FaCalendarAlt, FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomerOrderTrack = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const debounceTimeout = useRef(null);

    // Debounced search function
    const handleSearch = useCallback(
        async (query) => {
            if (!query.trim()) {
                toast.error("Please enter an order ID");
                setOrder(null);
                return;
            }

            setLoading(true);
            try {
                const queryParam = `orderId=${encodeURIComponent(query)}`;
                const response = await fetch(`/api/products/orders?${queryParam}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch order");
                }

                if (data.length === 0) {
                    setOrder(null);
                    toast.error("Order not found!");
                    return;
                }

                setOrder(data[0]);
                toast.success("Order found successfully!");
            } catch (error) {
                console.error("Error fetching order:", error);
                toast.error(`Error: ${error.message}`);
                setOrder(null);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Debounce search input
    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            handleSearch(query);
        }, 500);
    };

    // Handle PDF download
    const handleDownloadInvoice = async () => {
        if (!order) return;

        try {
            const response = await fetch("/api/generate-invoice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate invoice");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice_${order.orderId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Invoice downloaded successfully!");
        } catch (error) {
            console.error("Error downloading invoice:", error);
            toast.error(`Error: ${error.message}`);
        }
    };

    // Format Bkash number for security
    const formatBkashNumber = (number) => {
        if (!number || number.length !== 11) return number;
        return `${number.slice(0, 4)}***${number.slice(7)}`;
    };

    // Get status color and icon with 3 specific status designs
    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return {
                    color: 'text-green-400',
                    bg: 'bg-green-400/10',
                    border: 'border-green-400/30',
                    icon: FaCheckCircle,
                    gradient: 'from-green-500 to-emerald-500',
                    label: 'Order Accepted'
                };
            case 'rejected':
                return {
                    color: 'text-red-400',
                    bg: 'bg-red-400/10',
                    border: 'border-red-400/30',
                    icon: FaTimesCircle,
                    gradient: 'from-red-500 to-pink-500',
                    label: 'Order Rejected'
                };
            case 'pending':
            default:
                return {
                    color: 'text-yellow-400',
                    bg: 'bg-yellow-400/10',
                    border: 'border-yellow-400/30',
                    icon: FaClock,
                    gradient: 'from-yellow-500 to-orange-500',
                    label: 'Pending Review'
                };
        }
    };

    // Get payment method display
    const getPaymentMethodDisplay = (method) => {
        switch (method) {
            case 'cod':
                return { text: 'Cash on Delivery', color: 'text-yellow-400', icon: '💰' };
            case 'bkash':
                return { text: 'bKash Payment', color: 'text-green-400', icon: '📱' };
            case 'pay_first':
                return { text: 'Online Payment', color: 'text-blue-400', icon: '💳' };
            default:
                return { text: method, color: 'text-gray-400', icon: '💳' };
        }
    };

    const statusInfo = order ? getStatusInfo(order.status) : null;
    const paymentInfo = order ? getPaymentMethodDisplay(order.paymentMethod) : null;
    const StatusIcon = statusInfo?.icon;

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/20"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            </div>

            <ToastContainer
                position="top-center"
                autoClose={3000}
                theme="dark"
                toastClassName="bg-gray-800 text-white border border-purple-500/30"
            />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl mb-6 shadow-2xl shadow-purple-500/20">
                        <FaShoppingBag className="w-8 h-8 text-white" />
                    </div>

                    {/* SOOQRA ONE Brand */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg px-4 py-3">
                            <h4 className="text-purple-300 text-lg font-bold flex items-center justify-center gap-2">
                                <span className="bg-gradient-to-r from-purple-600/40 to-transparent px-3 py-1 rounded-md">SOOQRA</span>
                                <span className="bg-gradient-to-r from-purple-600/40 to-transparent text-purple-300 px-3 py-1 rounded-sm transform -rotate-2 shadow-lg">
                                    One
                                </span>
                            </h4>
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-4">
                        Order Tracking
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Track your order status and get real-time updates on your delivery
                    </p>
                </div>

                {/* Search Section */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleInputChange}
                                placeholder="Enter your order ID (e.g., ORDER_ABC123)"
                                className="w-full p-4 pl-12 rounded-xl bg-gray-800/80 backdrop-blur-sm text-gray-200 text-base border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                            />
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-300 text-lg">Searching for your order...</p>
                    </div>
                )}

                {/* Order Display */}
                {order && !loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">


                        {/* Order Overview Card */}
                        <div className="lg:col-span-3">
                            <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                                    {/* Left Section - Order Info */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                                        {StatusIcon && (
                                            <div className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-r ${statusInfo.gradient} shadow-lg flex-shrink-0`}>
                                                <StatusIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0 w-full">
                                            {/* Order ID with proper mobile break */}
                                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white break-all word-break-all hyphens-auto">
                                                Order #{order.orderId}
                                            </h2>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2">
                                                <span className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border shadow-lg w-fit`}>
                                                    {statusInfo.label}
                                                </span>
                                                <span className="text-gray-400 text-xs sm:text-sm flex items-center gap-2">
                                                    <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section - Amount & Button */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 lg:gap-6">
                                        <div className="text-center sm:text-right">
                                            <p className="text-gray-400 text-xs sm:text-sm">Total Amount</p>
                                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400 break-all">
                                                ৳{order.total.toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleDownloadInvoice}
                                            className="flex items-center justify-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 text-sm sm:text-base whitespace-nowrap"
                                        >
                                            <FaDownload className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            <span className="truncate">Download Invoice</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Customer Information */}
                            <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <FaUser className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Customer Information</h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-wide">Name</p>
                                        <p className="text-white font-medium">{order.customerInfo.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-wide">Email</p>
                                        <p className="text-white">{order.customerInfo.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-wide">Phone</p>
                                        <p className="text-white">{order.customerInfo.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <FaCreditCard className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Payment Information</h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-wide">Method</p>
                                        <p className={`font-medium ${paymentInfo.color} flex items-center gap-2`}>
                                            <span>{paymentInfo.icon}</span>
                                            {paymentInfo.text}
                                        </p>
                                    </div>
                                    {order.paymentMethod === 'bkash' && order.customerInfo.bkashNumber && (
                                        <>
                                            <div>
                                                <p className="text-gray-400 text-xs uppercase tracking-wide">bKash Number</p>
                                                <p className="text-white font-mono">
                                                    {formatBkashNumber(order.customerInfo.bkashNumber)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs uppercase tracking-wide">Transaction ID</p>
                                                <p className="text-white font-mono">{order.customerInfo.transactionId}</p>
                                            </div>
                                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mt-2">
                                                <p className="text-yellow-400 text-xs text-center">
                                                    🔒 For security, bKash number is partially hidden
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Middle Column - Order Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 shadow-xl hover:shadow-blue-500/10 transition-all duration-300 h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                        <FaShoppingBag className="w-5 h-5 text-green-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Order Items</h3>
                                </div>

                                <div className="space-y-4">
                                    {order.products.map((product, index) => (
                                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 hover:border-purple-500/30 transition-all duration-300">
                                            <div className="flex-1">
                                                <p className="text-white font-medium text-sm">{product.title}</p>
                                                {product.size && (
                                                    <p className="text-gray-400 text-xs">Size: {product.size}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white text-sm">৳{product.price.toLocaleString()} × {product.quantity}</p>
                                                <p className="text-green-400 font-semibold">৳{(product.price * product.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div className="mt-6 pt-6 border-t border-gray-600/30 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Subtotal</span>
                                        <span className="text-white">৳{order.products.reduce((sum, p) => sum + p.quantity * p.price, 0).toLocaleString()}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Discount</span>
                                            <span className="text-red-400">-৳{order.discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {order.shippingCharge > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Shipping</span>
                                            <span className="text-white">৳{order.shippingCharge.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-600/30">
                                        <span className="text-white">Total</span>
                                        <span className="text-green-400">৳{order.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="lg:col-span-3">
                            <div className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                                        <FaMapMarkerAlt className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Shipping Address</h3>
                                </div>
                                <div className="text-sm text-gray-300 space-y-2">
                                    <p className="text-white font-medium">{order.customerInfo.name}</p>
                                    <p>{order.customerInfo.address}</p>
                                    <p>
                                        {[
                                            order.customerInfo.city,
                                            order.customerInfo.district,
                                            order.customerInfo.thana,
                                        ]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                    <p>
                                        {order.customerInfo.postcode && `${order.customerInfo.postcode}, `}
                                        {order.customerInfo.country}
                                    </p>
                                    <p className="text-blue-400 font-medium mt-3 flex items-center gap-2">
                                        <span>📞</span>
                                        {order.customerInfo.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Results */}
                {searchQuery && !order && !loading && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-4 text-gray-500 opacity-50">
                            <FaSearch className="w-full h-full" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">Order Not Found</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            No order found with ID: <span className="text-purple-400 font-mono bg-purple-500/10 px-2 py-1 rounded">{searchQuery}</span>
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Please check your order ID and try again
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerOrderTrack;