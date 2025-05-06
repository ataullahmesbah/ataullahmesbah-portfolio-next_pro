'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AllProducts() {
    const { data: session } = useSession();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const fetchProducts = async () => {
        try {
            setIsRefreshing(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            console.log('Fetching from:', `${apiUrl}/api/products`);
            const res = await fetch(`${apiUrl}/api/products`, { cache: 'no-store' });
            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}: Failed to fetch products`);
            }
            const data = await res.json();
            console.log('Fetched products:', data);
            const productList = Array.isArray(data) ? data : data.message ? [] : data;
            setProducts(productList);
            setFilteredProducts(productList);
            setError(null);
            setCurrentPage(1); // Reset to first page on fetch
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter((product) => {
            const titleMatch = product.title
                .toLowerCase()
                .includes(searchTitle.toLowerCase().trim());
            const categoryMatch = searchCategory
                ? product.category?.name
                    ?.toLowerCase()
                    .includes(searchCategory.toLowerCase().trim()) ?? false
                : true;
            return titleMatch && categoryMatch;
        });
        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    }, [searchTitle, searchCategory, products]);

    const handleDelete = async (id) => {
        if (!session) {
            alert('You must be logged in to delete products');
            return;
        }
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            console.log('Attempting to delete product:', id);
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await res.json();
            console.log('Delete response:', result);
            if (res.ok) {
                alert('Product deleted successfully');
                fetchProducts();
            } else {
                alert(result.error || 'Failed to delete product');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete product: ' + err.message);
        }
    };

    const handleClearSearch = () => {
        setSearchTitle('');
        setSearchCategory('');
        setFilteredProducts(products);
        setCurrentPage(1);
    };

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
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
                <button
                    onClick={fetchProducts}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    disabled={isRefreshing}
                >
                    {isRefreshing ? (
                        <span className="flex items-center">
                            <svg
                                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Refreshing...
                        </span>
                    ) : (
                        'Retry'
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">All Products</h1>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    placeholder="Search by product title..."
                    className="px-4 py-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                />
                <input
                    type="text"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    placeholder="Search by category..."
                    className="px-4 py-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                />
                <div className="flex gap-2">
                    <button
                        onClick={handleClearSearch}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        disabled={!searchTitle && !searchCategory}
                    >
                        Clear
                    </button>
                    <button
                        onClick={fetchProducts}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? (
                            <span className="flex items-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Refreshing...
                            </span>
                        ) : (
                            'Refresh'
                        )}
                    </button>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <p>No products found. {searchTitle || searchCategory ? 'Try adjusting your search.' : ''}</p>
            ) : (
                <>
                    <table className="w-full border-collapse bg-white shadow-md rounded-lg mb-6">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-3 text-left">Title</th>
                                <th className="border p-3 text-left">Category</th>
                                <th className="border p-3 text-left">Quantity</th>
                                <th className="border p-3 text-left">Price (BDT)</th>
                                <th className="border p-3 text-left">Owner</th>
                                <th className="border p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((product) => {
                                const bdtPrice = product.prices.find((p) => p.currency === 'BDT')?.amount || 'N/A';
                                return (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="border p-3">{product.title}</td>
                                        <td className="border p-3">{product.category?.name || 'N/A'}</td>
                                        <td className="border p-3">{product.quantity}</td>
                                        <td className="border p-3">৳{bdtPrice}</td>
                                        <td className="border p-3">{product.owner || 'N/A'}</td>
                                        <td className="border p-3 flex gap-3">
                                            <Link
                                                href={`/shop/${product.slug}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/admin-dashboard/shop/update-product/${product._id}`}
                                                className="text-green-600 hover:text-green-800 font-medium"
                                            >
                                                Update
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                                disabled={!session}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 rounded-lg ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}