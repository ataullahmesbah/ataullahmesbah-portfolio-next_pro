// src/app/moderator-dashboard/products/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FiSearch } from 'react-icons/fi'; // Added for search icon

export default function AllProductsMod() {
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
           
            const res = await fetch(`${apiUrl}/api/products`, { cache: 'no-store' });
            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}: Failed to fetch products`);
            }
            const data = await res.json();
           
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
        return <div className="container mx-auto py-8 text-center text-purple-300">Loading...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">Moderator Products Dashboard</h1>
                <p className="text-red-500 text-center">{error}</p>
                <button
                    onClick={fetchProducts}
                    className="mt-4 mx-auto block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
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
        <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl text-purple-100 mb-8 text-center">All Listing Products Dashboard</h1>

                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-64">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                        <input
                            type="text"
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            placeholder="Search by product title..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-purple-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </div>
                    <div className="relative w-full sm:w-64">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                        <input
                            type="text"
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            placeholder="Search by category..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-purple-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleClearSearch}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            disabled={!searchTitle && !searchCategory}
                        >
                            Clear
                        </button>
                        <button
                            onClick={fetchProducts}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
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
                    <p className="text-center text-purple-300 text-lg">{searchTitle || searchCategory ? 'No products found. Try adjusting your search.' : 'No products found.'}</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full bg-gray-900 rounded-lg shadow-lg">
                                <thead>
                                    <tr className="bg-gray-800 text-purple-200">
                                        <th className="p-3 md:p-4 text-left">Title</th>
                                        <th className="p-3 md:p-4 text-left">Category</th>
                                        <th className="p-3 md:p-4 text-left">Quantity</th>
                                        <th className="p-3 md:p-4 text-left">Price (BDT)</th>
                                        <th className="p-3 md:p-4 text-left">Owner</th>
                                        <th className="p-3 md:p-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((product) => {
                                        const bdtPrice = product.prices.find((p) => p.currency === 'BDT')?.amount || 'N/A';
                                        return (
                                            <tr key={product._id} className="border-t border-gray-700 hover:bg-gray-800">
                                                <td className="p-3 md:p-4 text-white">{product.title}</td>
                                                <td className="p-3 md:p-4 text-purple-300">{product.category?.name || 'N/A'}</td>
                                                <td className="p-3 md:p-4 text-purple-300">{product.quantity}</td>
                                                <td className="p-3 md:p-4 text-green-300">৳{bdtPrice}</td>
                                                <td className="p-3 md:p-4 text-purple-300">{product.owner || 'N/A'}</td>
                                                <td className="p-3 md:p-4 flex gap-3">
                                                    <Link
                                                        href={`/shop/${product.slug}`}
                                                        className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/moderator-dashboard/shop/edit/${product._id}`}
                                                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                                                    >
                                                        Update
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center mt-6 space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 disabled:opacity-50 transition-all duration-300"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded ${currentPage === page
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-700 text-purple-200 hover:bg-gray-600'} transition-all duration-300`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 disabled:opacity-50 transition-all duration-300"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}