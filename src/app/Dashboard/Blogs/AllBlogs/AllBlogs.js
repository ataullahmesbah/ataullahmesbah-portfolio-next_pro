'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEye, FaTrashAlt, FaEdit } from 'react-icons/fa'; // Added FaEdit
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AllBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const blogsPerPage = 10;
    const [deleteSlug, setDeleteSlug] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Fetch blogs with pagination
    useEffect(() => {
        async function getBlogs() {
            setLoading(true);
            try {
                const res = await fetch(`/api/blog?page=${currentPage}&limit=${blogsPerPage}`, { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch blogs');
                const data = await res.json();
                setBlogs(data.blogs || []);
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
    }, [currentPage]); // Refetch when page changes

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

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">📝 All Blogs</h2>
                    <p className="text-lg text-gray-600">Total Blogs: {blogs.length}</p>
                </div>

                {/* Blog List */}
                {loading ? (
                    <p className="text-center text-gray-600">Loading blogs...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-800 text-left">
                                    <th className="p-3 border-b border-gray-200">#</th>
                                    <th className="p-3 border-b border-gray-200">Title</th>
                                    <th className="p-3 border-b border-gray-200">Author</th>
                                    <th className="p-3 border-b border-gray-200">Views</th>
                                    <th className="p-3 border-b border-gray-200 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.map((blog, index) => (
                                    <tr key={blog.slug} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-3 align-top">{(currentPage - 1) * blogsPerPage + index + 1}</td>
                                        <td className="p-3 align-top">
                                            <p className="font-semibold text-gray-800">{blog.title}</p>
                                            <p className="mt-2 text-gray-600 text-sm">
                                                {blog.metaDescription?.slice(0, 70)}...
                                            </p>
                                        </td>
                                        <td className="p-3 align-top">{blog.author}</td>
                                        <td className="p-3 align-top">{blog.views}</td>
                                        <td className="p-3 text-center align-top flex justify-center space-x-2">
                                            <Link
                                                href={`/blog/${blog.slug}`}
                                                className="text-blue-500 hover:text-blue-700 flex items-center bg-blue-50 px-3 py-1 rounded-lg shadow-sm"
                                            >
                                                <FaEye size={16} className="mr-1" />
                                                View
                                            </Link>


                                            <Link
                                                href={`/admin-dashboard/blog/edit/${blog.slug}`} // Adjust route as needed
                                                className="text-yellow-500 hover:text-yellow-700 flex items-center bg-yellow-50 px-3 py-1 rounded-lg shadow-sm"
                                            >
                                                <FaEdit size={16} className="mr-1" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setDeleteSlug(blog.slug);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="text-red-500 hover:text-red-700 flex items-center bg-red-50 px-3 py-1 rounded-lg shadow-sm"
                                            >
                                                <FaTrashAlt size={16} className="mr-1" />
                                                Delete
                                            </button>
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
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-gray-900 opacity-95 p-6 rounded-lg shadow-lg text-center">
                            <h2 className="text-white mb-4">Are you sure you want to delete?</h2>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={deleteBlog}
                                    className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 flex items-center"
                                >
                                    <FaTrashAlt size={18} className="mr-1" />
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