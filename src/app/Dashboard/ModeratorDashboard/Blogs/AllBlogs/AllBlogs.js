// src/app/moderator-dashboard/blog/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEye, FaEdit, FaSearch } from 'react-icons/fa'; // Removed FaTrashAlt, Added FaSearch
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AllBlogsModerator() {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]); // For search results
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // For search input
    const blogsPerPage = 10;

    // Fetch blogs with pagination
    useEffect(() => {
        async function getBlogs() {
            setLoading(true);
            try {
                const res = await fetch(`/api/blog?page=${currentPage}&limit=${blogsPerPage}`, { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch blogs');
                const data = await res.json();
                setBlogs(data.blogs || []);
                setFilteredBlogs(data.blogs || []); // Initialize filtered blogs
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

    // Handle search functionality
    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            setFilteredBlogs(blogs); // Reset to all blogs if search is empty
            return;
        }
        const filtered = blogs.filter(blog =>
            blog.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredBlogs(filtered);
    };

    // Handle pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="bg-gray-950 min-h-screen p-4 md:p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-purple-400 mb-4 sm:mb-0">📝 All Blogs</h2>
                    <p className="text-lg text-purple-200">Total Blogs: {filteredBlogs.length}</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search blogs by title..."
                        className="w-full sm:w-64 p-3 bg-gray-800 text-purple-200 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
                    >
                        <FaSearch size={16} className="mr-2" />
                        Search
                    </button>
                </div>

                {/* Blog List */}
                {loading ? (
                    <p className="text-center text-purple-300">Loading blogs...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="bg-gray-900 shadow-lg rounded-lg p-4 md:p-6 overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-800  text-purple-100 text-left">
                                    <th className="p-3 border-b border-gray-700">#</th>
                                    <th className="p-3 border-b border-gray-700 ">Title</th>
                                    <th className="p-3 border-b border-gray-700">Author</th>
                                    <th className="p-3 border-b border-gray-700">Views</th>
                                    <th className="p-3 border-b border-gray-700 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBlogs.map((blog, index) => (
                                    <tr key={blog.slug} className="border-b border-gray-700 hover:bg-gray-800">
                                        <td className="p-3 align-top text-purple-300">{(currentPage - 1) * blogsPerPage + index + 1}</td>
                                        <td className="p-3 align-top">
                                            <p className="text-xl text-white">{blog.title}</p>
                                            <p className="mt-2 text-purple-100 text-sm">
                                                {blog.metaDescription?.slice(0, 70)}...
                                            </p>
                                        </td>
                                        <td className="p-3 align-top text-purple-300">{blog.author}</td>
                                        <td className="p-3 align-top text-purple-300">{blog.views}</td>
                                        <td className="p-3 text-center align-top flex justify-center space-x-2">
                                            <Link
                                                href={`/blog/${blog.slug}`}
                                                className="text-purple-400 hover:text-purple-500 flex items-center bg-purple-800/50 px-3 py-1 rounded-lg shadow-sm"
                                            >
                                                <FaEye size={16} className="mr-1" />
                                                View
                                            </Link>
                                            <Link
                                                href={`/moderator-dashboard/blog/edit/${blog.slug}`}
                                                className="text-yellow-400 hover:text-yellow-500 flex items-center bg-yellow-800/50 px-3 py-1 rounded-lg shadow-sm"
                                            >
                                                <FaEdit size={16} className="mr-1" />
                                                Edit
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
                                    className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-purple-200 hover:bg-gray-600'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-700 text-purple-200 rounded hover:bg-gray-600 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}