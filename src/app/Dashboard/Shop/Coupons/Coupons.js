'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';

export default function Coupons() {
    const [coupons, setCoupons] = useState([]);
    const [filteredCoupons, setFilteredCoupons] = useState([]);
    const [code, setCode] = useState('');
    const [productId, setProductId] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [useType, setUseType] = useState('one-time');
    const [expiresAt, setExpiresAt] = useState('');
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            setError('');
            const response = await axios.get('/api/products/coupons');
            setCoupons(response.data);
            setFilteredCoupons(response.data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            setError('Failed to fetch coupons. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch products.');
        }
    };

    useEffect(() => {
        fetchCoupons();
        fetchProducts();
        // Set default expiresAt to 1 month from now
        const defaultExpiresAt = new Date();
        defaultExpiresAt.setMonth(defaultExpiresAt.getMonth() + 1);
        setExpiresAt(defaultExpiresAt.toISOString().slice(0, 16));
    }, []);

    const debouncedSearch = useCallback(
        debounce((searchTerm) => {
            setFilteredCoupons(
                coupons.filter(
                    (c) =>
                        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.productId?.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }, 300),
        [coupons]
    );

    useEffect(() => {
        debouncedSearch(search);
    }, [search, debouncedSearch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code || !productId || !discountPercentage || !useType || !expiresAt) {
            setError('All fields are required.');
            return;
        }
        if (Number(discountPercentage) < 0 || Number(discountPercentage) > 100) {
            setError('Discount percentage must be between 0 and 100.');
            return;
        }
        const expiresAtDate = new Date(expiresAt);
        if (isNaN(expiresAtDate.getTime())) {
            setError('Invalid expiry date.');
            return;
        }
        if (expiresAtDate < new Date()) {
            setError('Expiry date must be in the future.');
            return;
        }
        try {
            setError('');
            setLoading(true);
            await axios.post('/api/products/coupons', {
                code,
                productId,
                discountPercentage: Number(discountPercentage),
                useType,
                expiresAt: expiresAtDate.toISOString(),
            });
            alert('Coupon updated successfully');
            fetchCoupons();
            setCode('');
            setProductId('');
            setDiscountPercentage('');
            setUseType('one-time');
            const defaultExpiresAt = new Date();
            defaultExpiresAt.setMonth(defaultExpiresAt.getMonth() + 1);
            setExpiresAt(defaultExpiresAt.toISOString().slice(0, 16));
        } catch (error) {
            console.error('Error updating coupon:', error);
            setError(error.response?.data?.error || 'Failed to update coupon.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (code) => {
        if (confirm(`Delete coupon "${code}"?`)) {
            try {
                setError('');
                setLoading(true);
                await axios.delete('/api/products/coupons', { data: { code } });
                alert('Coupon deleted successfully');
                fetchCoupons();
            } catch (error) {
                console.error('Error deleting coupon:', error);
                setError(error.response?.data?.error || 'Failed to delete coupon.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-white mb-8 text-center">Manage Product Coupons</h1>

            {error && (
                <div className="bg-red-600/90 text-white p-4 rounded-lg mb-8 text-center animate-fade-in">
                    {error}
                </div>
            )}

            {loading && (
                <div className="text-center py-6">
                    <svg
                        className="animate-spin h-8 w-8 text-blue-500 mx-auto"
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
                </div>
            )}

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by code or product..."
                        className="w-full bg-gray-700 text-white px-4 py-3 pl-10 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <svg
                        className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <button
                    onClick={fetchCoupons}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                    disabled={loading}
                >
                    Refresh
                </button>
            </div>

            {/* Coupon Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-8 rounded-xl shadow-lg mb-8 border border-gray-700"
            >
                <h2 className="text-xl font-semibold text-white mb-6">Add/Update Product Coupon</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Coupon Code
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                            placeholder="e.g., SAVE10"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Product
                        </label>
                        <select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map((product) => (
                                <option key={product._id} value={product._id}>
                                    {product.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Discount Percentage (%)
                        </label>
                        <input
                            type="number"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                            min="0"
                            max="100"
                            placeholder="e.g., 10"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Use Type
                        </label>
                        <select
                            value={useType}
                            onChange={(e) => setUseType(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                        >
                            <option value="one-time">One-Time Use</option>
                            <option value="multiple">Multiple Uses</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Expires At
                        </label>
                        <input
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            required
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                    disabled={loading}
                >
                    Update Coupon
                </button>
            </form>

            {/* Coupon List */}
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-6">Current Product Coupons</h2>
                {filteredCoupons.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">
                        {search ? 'No coupons match your search.' : 'No coupons available.'}
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-300">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="py-3 px-4">Code</th>
                                    <th className="py-3 px-4">Product</th>
                                    <th className="py-3 px-4">Discount</th>
                                    <th className="py-3 px-4">Use Type</th>
                                    <th className="py-3 px-4">Expires At</th>
                                    <th className="py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCoupons.map((coupon) => (
                                    <tr key={coupon.code} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="py-3 px-4">{coupon.code}</td>
                                        <td className="py-3 px-4">{coupon.productId?.title || 'Unknown'}</td>
                                        <td className="py-3 px-4">{coupon.discountPercentage}%</td>
                                        <td className="py-3 px-4">
                                            {coupon.useType === 'one-time' ? 'One-Time' : 'Multiple'}
                                        </td>
                                        <td className="py-3 px-4">
                                            {new Date(coupon.expiresAt).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => handleDelete(coupon.code)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}