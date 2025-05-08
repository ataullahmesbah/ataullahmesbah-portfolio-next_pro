'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ShopClient({ products, structuredData }) {
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // Sort products
    const sortedProducts = useMemo(() => {
        switch (sortOption) {
            case 'newest':
                return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return [...products].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'price-low':
                return [...products].sort(
                    (a, b) =>
                        (a.prices.find((p) => p.currency === 'BDT')?.amount || 0) -
                        (b.prices.find((p) => p.currency === 'BDT')?.amount || 0)
                );
            case 'price-high':
                return [...products].sort(
                    (a, b) =>
                        (b.prices.find((p) => p.currency === 'BDT')?.amount || 0) -
                        (a.prices.find((p) => p.currency === 'BDT')?.amount || 0)
                );
            default:
                return [...products];
        }
    }, [products, sortOption]);

    // Pagination logic
    const currentProducts = sortedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    return (
        <div className="py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            {/* Header with Sort */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Available Products</h1>
                    <p className="text-gray-400">{sortedProducts.length} items</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-400 hidden sm:inline">Sort:</span>
                    <div className="relative">
                        <select
                            value={sortOption}
                            onChange={(e) => {
                                setSortOption(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="appearance-none bg-gray-800 text-white border border-gray-700 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length === 0 ? (
                <div className="text-center py-20 bg-gray-800 rounded-xl">
                    <p className="text-gray-400 mb-6">No products found</p>
                    <button
                        onClick={() => {
                            setSortOption('newest');
                            setCurrentPage(1);
                        }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {currentProducts.map((product) => {
                            const bdtPrice = product.prices.find((p) => p.currency === 'BDT')?.amount;

                            return (
                                <div key={product._id} className="group relative">
                                    <Link
                                        href={`/shop/${product.slug || product._id}`}
                                        className="block h-full rounded-xl overflow-hidden shadow-lg bg-gray-800 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                    >
                                        {/* Product Image */}
                                        <div className="relative aspect-square">
                                            <Image
                                                src={product.mainImage}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-opacity opacity-0 duration-300"
                                                onLoad={(e) => e.target.classList.remove('opacity-0')}
                                                loading="lazy"
                                            />
                                            {/* Stock Status Badge - Top Right */}
                                            <div
                                                className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${product.quantity > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                                                    }`}
                                            >
                                                {product.quantity > 0 ? 'In Stock' : 'Stock Out'}
                                            </div>
                                        </div>

                                        {/* Product Info - Fixed Height Container */}
                                        <div className="p-5  flex flex-col" style={{ minHeight: '140px' }}>
                                            {/* Title - Takes available space */}
                                            <h3 className="font-medium text-lg text-white mb-2 line-clamp-2 flex-grow">
                                                {product.title}
                                            </h3>

                                            {/* Price & Available - Aligned at bottom */}
                                            <div className="mt-auto pt-3 flex justify-between items-center">
                                                <p className="text-xl font-bold text-white">
                                                    ৳{bdtPrice?.toLocaleString() || 'N/A'}
                                                </p>
                                                {product.quantity > 0 && (
                                                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                                                        {product.quantity} in stock
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex justify-center">
                            <nav className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 disabled:opacity-50 hover:bg-gray-700 transition"
                                >
                                    ←
                                </button>

                                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                                    let page;
                                    if (totalPages <= 5) {
                                        page = i + 1;
                                    } else if (currentPage <= 3) {
                                        page = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        page = totalPages - 4 + i;
                                    } else {
                                        page = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg ${currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                                                } transition`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 disabled:opacity-50 hover:bg-gray-700 transition"
                                >
                                    →
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}