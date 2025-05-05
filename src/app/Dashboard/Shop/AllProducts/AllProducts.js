'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AllProducts() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' });
            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}: Failed to fetch products`);
            }
            const data = await res.json();
            console.log('Fetched products:', data); // Debug log
            // Handle both array and object responses
            const productList = Array.isArray(data) ? data : data.message ? [] : data;
            setProducts(productList);
            setIsLoading(false);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert('Product deleted successfully');
                fetchProducts(); // Refresh the product list
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Failed to delete product');
            }
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    if (isLoading) {
        return <div className="container mx-auto py-8">Loading...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">All Products</h1>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">All Products</h1>
            {products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-3 text-left">Title</th>
                            <th className="border p-3 text-left">Category</th>
                            <th className="border p-3 text-left">Price (BDT)</th>
                            <th className="border p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            const bdtPrice = product.prices.find((p) => p.currency === 'BDT')?.amount || 'N/A';
                            return (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="border p-3">{product.title}</td>
                                    <td className="border p-3">{product.category?.name || 'N/A'}</td>
                                    <td className="border p-3">৳{bdtPrice}</td>
                                    <td className="border p-3 flex gap-3">
                                        <Link
                                            href={`/shop/${product.slug}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={`/admin/update-product/${product._id}`}
                                            className="text-green-600 hover:text-green-800 font-medium"
                                        >
                                            Update
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}