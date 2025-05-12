'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Coupons() {
    const [coupons, setCoupons] = useState([]);
    const [filteredCoupons, setFilteredCoupons] = useState([]);
    const [code, setCode] = useState('');
    const [productId, setProductId] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);

    const fetchCoupons = async () => {
        try {
            const response = await axios.get('/api/products/coupons');
            setCoupons(response.data);
            setFilteredCoupons(response.data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    };

    useEffect(() => {
        fetchCoupons();
        axios.get('/api/products')
            .then(response => setProducts(response.data))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    useEffect(() => {
        setFilteredCoupons(
            coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()) ||
                c.productId?.title.toLowerCase().includes(search.toLowerCase()))
        );
    }, [search, coupons]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/products/coupons', {
                code,
                productId,
                discountPercentage: Number(discountPercentage),
            });
            alert('Coupon updated');
            fetchCoupons();
            setCode('');
            setProductId('');
            setDiscountPercentage('');
        } catch (error) {
            console.error('Error updating coupon:', error);
            alert('Failed to update coupon');
        }
    };

    const handleDelete = async (code) => {
        if (confirm(`Delete coupon ${code}?`)) {
            try {
                await axios.delete('/api/products/coupons', { data: { code } });
                alert('Coupon deleted');
                fetchCoupons();
            } catch (error) {
                console.error('Error deleting coupon:', error);
                alert('Failed to delete coupon');
            }
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-white mb-6">Manage Coupons</h1>
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by code or product"
                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-md"
                />
                <button
                    onClick={fetchCoupons}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Refresh
                </button>
            </div>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Coupon Code</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 text-white px-3 py-2 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Product</label>
                    <select
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 text-white px-3 py-2 rounded-md"
                        required
                    >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option key={product._id} value={product._id}>{product.title}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Discount Percentage</label>
                    <input
                        type="number"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 text-white px-3 py-2 rounded-md"
                        required
                        min="0"
                        max="100"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Update Coupon
                </button>
            </form>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Current Coupons</h2>
                <ul className="space-y-2">
                    {filteredCoupons.map((coupon) => (
                        <li key={coupon.code} className="flex justify-between text-gray-300">
                            <span>{coupon.code}: {coupon.discountPercentage}% off {coupon.productId?.title || 'Product'}</span>
                            <button
                                onClick={() => handleDelete(coupon.code)}
                                className="text-red-500 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}