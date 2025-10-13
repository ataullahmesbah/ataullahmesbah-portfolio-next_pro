'use client';

import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ currentPage, totalPages, basePath }) {
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2">
                {prevPage ? (
                    <Link
                        href={`${basePath}?page=${prevPage}`}
                        className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition flex items-center"
                    >
                        <FiChevronLeft className="mr-1" /> Previous
                    </Link>
                ) : (
                    <span className="px-4 py-2 border border-gray-800 rounded-lg text-gray-500 cursor-not-allowed flex items-center">
                        <FiChevronLeft className="mr-1" /> Previous
                    </span>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Link
                        key={page}
                        href={`${basePath}?page=${page}`}
                        className={`px-4 py-2 rounded-lg transition ${page === currentPage
                            ? 'bg-indigo-700 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                            }`}
                    >
                        {page}
                    </Link>
                ))}

                {nextPage ? (
                    <Link
                        href={`${basePath}?page=${nextPage}`}
                        className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition flex items-center"
                    >
                        Next <FiChevronRight className="ml-1" />
                    </Link>
                ) : (
                    <span className="px-4 py-2 border border-gray-800 rounded-lg text-gray-500 cursor-not-allowed flex items-center">
                        Next <FiChevronRight className="ml-1" />
                    </span>
                )}
            </nav>
        </div>
    );
}