'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AllProducts() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products`, { cache: 'no-store' });
            if (!res.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await res.json();
            setProducts(data);
            setIsLoading(false);
        } catch (err) {
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
                alert('Product deleted');
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
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Price (BDT)</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            // Find BDT price from prices array
                            const bdtPrice = product.prices.find((p) => p.currency === 'BDT')?.amount || 'N/A';
                            return (
                                <tr key={product._id}>
                                    <td className="border p-2">{product.title}</td>
                                    <td className="border p-2">{bdtPrice}</td>
                                    <td className="border p-2 flex gap-2">
                                        <Link
                                            href={`/shop/${product._id}`}
                                            className="text-blue-500 hover:underline"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={`/admin/update-product/${product._id}`}
                                            className="text-green-500 hover:underline"
                                        >
                                            Update
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="text-red-500 hover:underline"
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