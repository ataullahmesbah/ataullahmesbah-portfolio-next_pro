// src/app/newsletterinfo/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi'; // Added for search icon

const AllNewsLetterMod = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [filteredNewsletters, setFilteredNewsletters] = useState([]); // Added for search
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); // Added for search
    const [currentPage, setCurrentPage] = useState(1); // Added for pagination
    const newslettersPerPage = 10; // Added for pagination

    const fetchNewsletters = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/newsletter/letter');
            const data = await res.json();
            setNewsletters(data);
            setFilteredNewsletters(data); // Initialize filtered newsletters
        } catch (error) {
            toast.error('Error fetching newsletters');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsletters();
    }, []);

    // Search functionality
    useEffect(() => {
        setFilteredNewsletters(
            newsletters.filter(newsletter =>
                newsletter.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
        setCurrentPage(1); // Reset to first page on search
    }, [searchQuery, newsletters]);

    // Pagination Logic
    const indexOfLastNewsletter = currentPage * newslettersPerPage;
    const indexOfFirstNewsletter = indexOfLastNewsletter - newslettersPerPage;
    const currentNewsletters = filteredNewsletters.slice(indexOfFirstNewsletter, indexOfLastNewsletter);
    const totalPages = Math.ceil(filteredNewsletters.length / newslettersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-4 md:p-10">
            <Toaster position="top-center" />
            <h1 className="text-4xl font-bold text-purple-400 mb-10 text-center">
                All Newsletters
            </h1>

            {/* Search Bar */}
            <div className="max-w-5xl mx-auto mb-8 flex justify-center">
                <div className="relative w-full sm:w-64">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-purple-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                </div>
            </div>

            {currentNewsletters.length === 0 ? (
                <p className="text-center text-purple-300 text-lg">No newsletters found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-gray-900 rounded-lg shadow-lg">
                        <thead className="bg-gray-800 text-purple-200 sticky top-0">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Publish Date</th>
                                <th className="p-4">Views</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentNewsletters.map((newsletter) => (
                                <tr
                                    key={newsletter._id}
                                    className="border-t border-gray-700 hover:bg-gray-800"
                                >
                                    <td className="p-4 text-purple-300">{newsletter.title}</td>
                                    <td className="p-4 text-purple-300">{newsletter.category}</td>
                                    <td className="p-4 text-purple-300">{newsletter.author}</td>
                                    <td className="p-4 text-purple-300">{new Date(newsletter.publishDate).toLocaleDateString()}</td>
                                    <td className="p-4 text-purple-300">{newsletter.views}</td>
                                    <td className="p-4 flex space-x-3">
                                        <Link href={`/letter/${newsletter.slug}`}>
                                            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300">
                                                View
                                            </button>
                                        </Link>
                                        <Link href={`/moderator-dashboard/newsletter/edit/${newsletter._id}`}>
                                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300">
                                                Update
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 disabled:opacity-50 transition-all duration-300"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-purple-200 hover:bg-gray-600'} transition-all duration-300`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 disabled:opacity-50 transition-all duration-300"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AllNewsLetterMod;