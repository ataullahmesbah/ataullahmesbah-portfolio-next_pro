// app/components/Travel/HistoricalPage.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HistoricalPage({ historical = [] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Filter to ensure only historical items (double protection)
    const filteredHistorical = historical.filter(item => item.category === 'Historical');
    const totalPages = Math.ceil(filteredHistorical.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredHistorical.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Historical Travel Sites</h1>
                    <div className="w-20 h-1 bg-green-600 mx-auto mb-6"></div>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {filteredHistorical.length} historical sites discovered
                    </p>
                </div>

                {/* Show message if no historical sites */}
                {filteredHistorical.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-400">No historical sites found</p>
                        <Link href="/mesbahoffwego" className="mt-6 inline-block text-green-400 hover:underline">
                            Back to Travel Home
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Historical Sites Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {currentItems.map(site => (
                                <div key={site._id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                                    <div className="relative h-60">
                                        <Image
                                            src={site.imageUrl}
                                            alt={site.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                                        <span className="absolute top-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm">
                                            {site.location}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{site.title}</h3>
                                        <p className="text-gray-300 mb-4 line-clamp-3">
                                            {site.description}
                                        </p>
                                        <Link
                                            href={`/mesbahoffwego/${site.slug}`}
                                            className="inline-flex items-center text-green-400 hover:text-green-300 font-medium"
                                        >
                                            Discover More
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50"
                                >
                                    &larr; Prev
                                </button>

                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => paginate(pageNum)}
                                            className={`w-10 h-10 rounded-full ${currentPage === pageNum ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50"
                                >
                                    Next &rarr;
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Back Link */}
                <div className="text-center mt-12">
                    <Link
                        href="/mesbahoffwego"
                        className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Travel Home
                    </Link>
                </div>
            </div>
        </div>
    );
}