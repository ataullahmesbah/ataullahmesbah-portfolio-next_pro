'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEye, FaTrashAlt, FaEdit, FaSearch, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AllBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const blogsPerPage = 10;
    const [deleteSlug, setDeleteSlug] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // New state variables for search and filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');

    // Fetch blogs with pagination
    useEffect(() => {
        async function getBlogs() {
            setLoading(true);
            try {
                const res = await fetch(`/api/blog?page=${currentPage}&limit=${blogsPerPage}`, { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch blogs');
                const data = await res.json();
                setBlogs(data.blogs || []);
                setFilteredBlogs(data.blogs || []);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error(err);
                setError(err.message);
                toast.error('Failed to load blogs');
            } finally {
                setLoading(false);
            }
        }
        getBlogs();
    }, [currentPage]);

    // Filter blogs based on search term and filters
    useEffect(() => {
        let result = blogs;

        // Apply search filter
        if (searchTerm) {
            result = result.filter(blog =>
                blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                blog.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter(blog => blog.status === statusFilter);
        }

        // Apply date filter
        if (dateFilter) {
            result = result.filter(blog => {
                const blogDate = new Date(blog.publishDate).toISOString().split('T')[0];
                return blogDate === dateFilter;
            });
        }

        setFilteredBlogs(result);
    }, [searchTerm, statusFilter, dateFilter, blogs]);

    // Delete blog function
    const deleteBlog = async () => {
        if (!deleteSlug) return;
        try {
            const res = await fetch(`/api/blog?slug=${deleteSlug}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete blog');
            setBlogs(blogs.filter(blog => blog.slug !== deleteSlug));
            setShowDeleteModal(false);
            toast.success('Blog deleted successfully!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete blog');
        }
    };

    // Pagination logic
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status badge class based on status
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
                toastClassName="bg-gray-800 text-white"
            />

            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-2">
                            📝 All Blog Posts
                        </h2>
                        <p className="text-gray-400">Total Blogs: {blogs.length}</p>
                    </div>

                    <Link
                        href="/admin-dashboard/blog/addblogpost"
                        className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center"
                    >
                        + Create New Blog
                    </Link>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaFilter className="text-gray-400" />
                            </div>
                            <select
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="pending">Pending</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaCalendarAlt className="text-gray-400" />
                            </div>
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchTerm || statusFilter !== 'all' || dateFilter) && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setDateFilter('');
                            }}
                            className="mt-4 px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>

                {/* Blog List */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
                        <p className="text-red-300">{error}</p>
                    </div>
                ) : (
                    <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-700 text-gray-300 text-left">
                                        <th className="p-4 font-semibold">Title</th>
                                        <th className="p-4 font-semibold">Author</th>
                                        <th className="p-4 font-semibold">Views</th>
                                        <th className="p-4 font-semibold">Publish Date</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBlogs.map((blog, index) => (
                                        <tr key={blog.slug} className="border-t border-gray-700 hover:bg-gray-750 transition-colors">
                                            <td className="p-4">
                                                <p className="font-medium text-white">{blog.title}</p>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    {blog.metaDescription?.slice(0, 70)}...
                                                </p>
                                            </td>
                                            <td className="p-4 text-gray-300">{blog.author}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200">
                                                    {blog.views || 0}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-400">{formatDate(blog.publishDate)}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(blog.status)}`}>
                                                    {blog.status || 'draft'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center space-x-2">
                                                    <Link
                                                        href={`/blog/${blog.slug}`}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                                                        title="View"
                                                    >
                                                        <FaEye size={16} />
                                                    </Link>

                                                    <Link
                                                        href={`/admin-dashboard/blog/edit/${blog.slug}`}
                                                        className="text-yellow-400 hover:text-yellow-300 transition-colors p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                                                        title="Edit"
                                                    >
                                                        <FaEdit size={16} />
                                                    </Link>

                                                    <button
                                                        onClick={() => {
                                                            setDeleteSlug(blog.slug);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
                                                        title="Delete"
                                                    >
                                                        <FaTrashAlt size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredBlogs.length === 0 && !loading && (
                            <div className="text-center py-12 text-gray-400">
                                <p>No blogs found matching your criteria.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 bg-gray-750 border-t border-gray-700">
                                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                                    <div className="text-sm text-gray-400">
                                        Showing page {currentPage} of {totalPages}
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>

                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            // Show pages around current page
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
                                                    className={`px-4 py-2 rounded-lg ${currentPage === pageNum
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                        } transition-colors`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}

                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
                            <h2 className="text-xl font-bold text-white mb-4">Confirm Deletion</h2>
                            <p className="text-gray-300 mb-6">Are you sure you want to delete this blog? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-5 py-2.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={deleteBlog}
                                    className="px-5 py-2.5 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors flex items-center"
                                >
                                    <FaTrashAlt size={16} className="mr-2" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}