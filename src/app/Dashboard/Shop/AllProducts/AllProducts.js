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
    const [searchProductCode, setSearchProductCode] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [darkMode, setDarkMode] = useState(false);
    const productsPerPage = 10;

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const fetchProducts = async () => {
        try {
            setIsRefreshing(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const res = await fetch(`${apiUrl}/api/products`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch products`);
            const data = await res.json();
            const productList = Array.isArray(data) ? data : data.message ? [] : data;
            setProducts(productList);
            setFilteredProducts(productList);
            setError(null);
            setCurrentPage(1);
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
        // Check for saved dark mode preference
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        const filtered = products.filter((product) => {
            const titleMatch = product.title?.toLowerCase().includes(searchTitle.toLowerCase().trim()) ?? false;
            const categoryMatch = searchCategory
                ? product.category?.name?.toLowerCase().includes(searchCategory.toLowerCase().trim()) ?? false
                : true;
            const codeMatch = searchProductCode
                ? product.product_code?.toLowerCase().includes(searchProductCode.toLowerCase().trim()) ?? false
                : true;
            return titleMatch && categoryMatch && codeMatch;
        });
        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [searchTitle, searchCategory, searchProductCode, products]);

    const handleDelete = async (id) => {
        if (!session) {
            alert('You must be logged in to delete products');
            return;
        }
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const result = await res.json();
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
        setSearchProductCode('');
    };

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
                <div className="container mx-auto py-8 px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">All Products</h1>
                        <div className="animate-pulse h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    </div>
                    <div className="animate-pulse h-96 w-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
                <div className="container mx-auto py-8 px-4">
                    <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">All Products</h1>
                    <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 dark:bg-purple-600 dark:hover:bg-purple-700"
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Refreshing...
                            </>
                        ) : (
                            'Retry'
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">All Products</h1>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>

                {/* Search Controls */}
                <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            placeholder="Search by title..."
                            className="w-full px-4 py-2 border rounded-lg text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        {searchTitle && (
                            <button
                                onClick={() => setSearchTitle('')}
                                className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            placeholder="Search by category..."
                            className="w-full px-4 py-2 border rounded-lg text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        {searchCategory && (
                            <button
                                onClick={() => setSearchCategory('')}
                                className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchProductCode}
                            onChange={(e) => setSearchProductCode(e.target.value)}
                            placeholder="Search by product code..."
                            className="w-full px-4 py-2 border rounded-lg text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        {searchProductCode && (
                            <button
                                onClick={() => setSearchProductCode('')}
                                className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleClearSearch}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 flex-1"
                            disabled={!searchTitle && !searchCategory && !searchProductCode}
                        >
                            Clear All
                        </button>
                        <button
                            onClick={fetchProducts}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 flex items-center gap-2 flex-1"
                            disabled={isRefreshing}
                        >
                            {isRefreshing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Refreshing
                                </>
                            ) : (
                                'Refresh'
                            )}
                        </button>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            No products found. {searchTitle || searchCategory || searchProductCode ? 'Try adjusting your search.' : ''}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Products Table */}
                        <div className="overflow-x-auto rounded-lg shadow-md mb-8">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-100 dark:bg-gray-800">
                                    <tr>
                                        <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-medium">Title</th>
                                        <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-medium">Category</th>
                                        <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-medium">Code</th>
                                        <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-medium">Quantity</th>
                                        <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-medium">Price (BDT)</th>
                                        <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-medium">Owner</th>
                                        <th className="p-4 text-left text-gray-700 dark:text-gray-300 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {currentProducts.map((product) => {
                                        const bdtPrice = product.prices?.find((p) => p.currency === 'BDT')?.amount || 'N/A';
                                        return (
                                            <tr key={product._id} className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800">
                                                <td className="p-4 text-gray-800 dark:text-gray-200">{product.title}</td>
                                                <td className="p-4 text-gray-600 dark:text-gray-400">{product.category?.name || 'N/A'}</td>
                                                <td className="p-4 text-gray-600 dark:text-gray-400 font-mono">
                                                    {product.product_code || 'N/A'}
                                                </td>
                                                <td className="p-4 text-gray-600 dark:text-gray-400">{product.quantity}</td>
                                                <td className="p-4 text-gray-800 dark:text-gray-200 font-medium">৳{bdtPrice}</td>
                                                <td className="p-4 text-gray-600 dark:text-gray-400">{product.owner || 'N/A'}</td>
                                                <td className="p-4">
                                                    <div className="flex gap-3">
                                                        <Link
                                                            href={`/shop/${product.slug}`}
                                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={`/admin-dashboard/shop/update-product/${product._id}`}
                                                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium text-sm"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(product._id)}
                                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                                                            disabled={!session}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            >
                                Previous
                            </button>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded-lg ${currentPage === page
                                        ? 'bg-purple-600 text-white dark:bg-purple-700'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
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