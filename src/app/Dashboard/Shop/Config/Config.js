'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Config() {
    const [code, setCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState('');
    const [minCartTotal, setMinCartTotal] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchConfig = async () => {
        setLoading(true);
        try {
            setError('');
            const response = await axios.get('/api/products/config');
            console.log('Fetch config response:', response.data);
            if (response.data && response.data.code) {
                setCode(response.data.code);
                setDiscountAmount(response.data.discountAmount ? response.data.discountAmount.toString() : '');
                setMinCartTotal(response.data.minCartTotal ? response.data.minCartTotal.toString() : '');
                setExpiresAt(response.data.expiresAt ? new Date(response.data.expiresAt).toISOString().slice(0, 16) : '');
            } else {
                console.log('No global coupon found, setting defaults');
                setCode('');
                setDiscountAmount('');
                setMinCartTotal('');
            }
        } catch (error) {
            console.error('Error fetching config:', error.response?.data || error.message);
            setError(`Failed to fetch global coupon: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
        if (!expiresAt) {
            const defaultExpiresAt = new Date();
            defaultExpiresAt.setMonth(defaultExpiresAt.getMonth() + 1);
            setExpiresAt(defaultExpiresAt.toISOString().slice(0, 16));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code || !discountAmount || !minCartTotal || !expiresAt) {
            setError('All fields are required.');
            return;
        }
        if (Number(discountAmount) < 0) {
            setError('Discount amount cannot be negative.');
            return;
        }
        if (Number(minCartTotal) < 0) {
            setError('Minimum cart total cannot be negative.');
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
            const response = await axios.post('/api/products/config', {
                code,
                discountAmount: Number(discountAmount),
                minCartTotal: Number(minCartTotal),
                expiresAt: expiresAtDate.toISOString(),
            });
            console.log('Update config response:', response.data);
            alert('Global coupon updated successfully');
            fetchConfig();
        } catch (error) {
            console.error('Error updating config:', error.response?.data || error.message);
            setError(error.response?.data?.error || 'Failed to update global coupon.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-white mb-8 text-center">Manage Global Coupon</h1>

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

            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-8 rounded-xl shadow-lg mb-8 border border-gray-700 max-w-md mx-auto"
            >
                <h2 className="text-xl font-semibold text-white mb-6">Set Global Coupon</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Coupon Code
                    </label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                        placeholder="e.g., GLOBAL350"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Discount Amount (BDT)
                    </label>
                    <input
                        type="number"
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(e.target.value)}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                        min="0"
                        placeholder="e.g., 350"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Minimum Cart Total (BDT)
                    </label>
                    <input
                        type="number"
                        value={minCartTotal}
                        onChange={(e) => setMinCartTotal(e.target.value)}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        required
                        min="0"
                        placeholder="e.g., 3000"
                    />
                </div>
                <div className="mb-4">
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
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                    disabled={loading}
                >
                    Update Global Coupon
                </button>
            </form>
        </div>
    );
}