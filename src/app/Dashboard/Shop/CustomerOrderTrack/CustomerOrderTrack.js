"use client";
import { useState, useCallback, useRef } from "react";
import { FaSearch } from "react-icons/fa";
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

                setOrder(data[0]); // Assuming orderId is unique
                toast.success("Order found!");
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
        }, 300); // 300ms debounce
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/80 to-gray-950 py-12">
            <ToastContainer position="top-center" autoClose={3000} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3 text-center">
                    Sooqra One Order Tracking
                </h1>
                <p className="text-base text-gray-300 mb-8 text-center">
                    Track your order easily with your order ID
                </p>

                {/* Search Bar */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch(searchQuery);
                    }}
                    className="max-w-lg mx-auto mb-10"
                >
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            placeholder="Enter order ID"
                            className="w-full p-3 rounded-lg bg-gray-900/80 text-gray-200 text-sm border border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                            disabled={loading}
                        >
                            <FaSearch className="w-4 h-4" />
                        </button>
                    </div>
                </form>

                {/* Order Display */}
                {loading ? (
                    <div className="h-6 w-6 mx-auto border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                ) : order ? (
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* Customer Information */}
                        <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-600/40 rounded-lg p-5 shadow-md hover:shadow-purple-500/30 transition-all duration-300">
                            <h2 className="text-base font-semibold text-purple-400 mb-3">
                                Customer Information
                            </h2>
                            <div className="text-sm text-gray-300 space-y-1">
                                <p><strong>Name:</strong> {order.customerInfo.name}</p>
                                <p><strong>Email:</strong> {order.customerInfo.email}</p>
                                <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                                <p>
                                    <strong>Address:</strong>{" "}
                                    {[
                                        order.customerInfo.address,
                                        order.customerInfo.city,
                                        order.customerInfo.postcode,
                                        order.customerInfo.district,
                                        order.customerInfo.thana,
                                        order.customerInfo.country,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                            </div>
                        </div>

                        {/* Item Details / Order Summary */}
                        <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-600/40 rounded-lg p-5 shadow-md hover:shadow-purple-500/30 transition-all duration-300">
                            <h2 className="text-base font-semibold text-purple-400 mb-3">
                                Item Details / Order Summary
                            </h2>
                            <div className="text-sm text-gray-300 space-y-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-200">Products:</h3>
                                    <ul className="list-disc list-inside ml-2">
                                        {order.products.map((product, index) => (
                                            <li key={index}>
                                                {product.title} (Quantity: {product.quantity}, Price: ৳{product.price}, Total: ৳
                                                {(product.quantity * product.price).toFixed(2)})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p>
                                    <strong>Subtotal:</strong> ৳
                                    {order.products
                                        .reduce((sum, p) => sum + p.quantity * p.price, 0)
                                        .toFixed(2)}
                                </p>
                                <p><strong>Discount:</strong> ৳{order.discount.toFixed(2)}</p>
                                <p><strong>Shipping Charge:</strong> ৳{order.shippingCharge.toFixed(2)}</p>
                                <p><strong>Total:</strong> ৳{order.total.toFixed(2)}</p>
                                <p>
                                    <strong>Payment Method:</strong>{" "}
                                    {order.paymentMethod === "cod" ? "Cash on Delivery" : "Pre-Paid"}
                                </p>
                                <p><strong>Order Status:</strong> {order.status}</p>
                                <p>
                                    <strong>Order Date:</strong>{" "}
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Download Button */}
                        <div className="text-center">
                            <button
                                onClick={handleDownloadInvoice}
                                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                                disabled={loading}
                            >
                                Download Receipt
                            </button>
                        </div>
                    </div>
                ) : (
                    searchQuery && !order && (
                        <div className="text-center text-red-400 text-sm font-medium">
                            Order not found!
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default CustomerOrderTrack;