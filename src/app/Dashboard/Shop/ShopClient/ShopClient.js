'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ShopClient({ products, structuredData }) {
    const [sortOption, setSortOption] = useState('newest');

    const sortedProducts = useMemo(() => {
        const sorted = [...products];
        switch (sortOption) {
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'newest':
                return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'price-low':
                return sorted.sort(
                    (a, b) =>
                        (a.prices.find((p) => p.currency === 'BDT')?.amount || 0) -
                        (b.prices.find((p) => p.currency === 'BDT')?.amount || 0)
                );
            case 'price-high':
                return sorted.sort(
                    (a, b) =>
                        (b.prices.find((p) => p.currency === 'BDT')?.amount || 0) -
                        (a.prices.find((p) => p.currency === 'BDT')?.amount || 0)
                );
            default:
                return sorted;
        }
    }, [products, sortOption]);

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">Shop</h1>

                <div className='flex gap-2 items-center'>
                    <p> Sort by </p>
                    <div className="relative">


                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="appearance-none bg-gray-800 text-white border border-gray-700 rounded-lg py-2 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Sort products"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                        <svg
                            className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

            </div>
            {sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-400 text-lg mb-4">No products available at the moment.</p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Return to Home
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => {
                        const bdtPrice = product.prices.find((p) => p.currency === 'BDT')?.amount || 'N/A';
                        return (
                            <div
                                key={product._id}
                                className="border border-gray-700 rounded-lg shadow-lg p-4 bg-gray-800 hover:shadow-xl transition transform hover:-translate-y-1"
                            >
                                <Link href={`/shop/${product.slug}`} className="block">
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={product.mainImage}
                                            alt={product.title}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                                            className="rounded object-cover"
                                            priority={sortedProducts.indexOf(product) < 4}
                                            loading={sortedProducts.indexOf(product) < 4 ? 'eager' : 'lazy'}
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mt-4 truncate">{product.title}</h3>
                                    <p className="text-gray-300">BDT ৳{bdtPrice}</p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}