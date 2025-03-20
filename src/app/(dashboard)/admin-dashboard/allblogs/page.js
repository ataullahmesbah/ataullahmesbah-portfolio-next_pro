'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEye, FaTrashAlt } from 'react-icons/fa'; // Import icons
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

export default function AllBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 10; // Show 10 blogs per page
    const [deleteSlug, setDeleteSlug] = useState(null); // Track which blog is being deleted
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal visibility

    // Fetch blogs on component mount
    useEffect(() => {
        async function getBlogs() {
            const res = await fetch('/api/blog', { cache: 'no-store' });

            if (!res.ok) {
                console.error('Failed to fetch blogs');
                return;
            }

            const data = await res.json();
            setBlogs(data);
        }

        getBlogs();
    }, []);

    // Delete blog function
    const deleteBlog = async () => {
        if (!deleteSlug) return;

        const res = await fetch(`/api/blog?slug=${deleteSlug}`, { method: 'DELETE' });

        if (res.ok) {
            setBlogs(blogs.filter(blog => blog.slug !== deleteSlug));
            setShowDeleteModal(false);
            toast.success('Blog deleted successfully!'); // Show success toast
        } else {
            console.error('Failed to delete blog');
            toast.error('Failed to delete blog'); // Show error toast
        }
    };

    // Pagination logic
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
    const totalPages = Math.ceil(blogs.length / blogsPerPage);

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">📝 All Blogs</h2>
                    <p className="text-lg text-gray-600">Total Blogs: {blogs.length}</p>
                </div>

                {/* Blog List */}
                <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-800 text-left">
                                <th className="p-3 border-b border-gray-200">#</th>
                                <th className="p-3 border-b border-gray-200">Title</th>
                                <th className="p-3 border-b border-gray-200">Author</th>
                                <th className="p-3 border-b border-gray-200 text-center">VIEW</th>
                                <th className="p-3 border-b border-gray-200 text-center">DELETE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBlogs.map((blog, index) => (
                                <tr key={blog.slug} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-3 align-top">{indexOfFirstBlog + index + 1}</td>
                                    <td className="p-3 align-top">
                                        <p className="font-semibold text-gray-800">{blog.title}</p>
                                        <p className="mt-2 text-gray-600 text-sm">
                                            {blog.metaDescription?.slice(0, 70)}...
                                        </p>
                                    </td>
                                    <td className="p-3 align-top">{blog.writer}</td>
                                    <td className="p-3 text-center align-top">
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="text-blue-500 hover:text-blue-700 mr-4 flex items-center justify-center bg-blue-50 px-4 py-2 rounded-lg shadow-sm"
                                        >
                                            <FaEye size={18} className="mr-1" />
                                            <span>View</span>
                                        </Link>
                                    </td>
                                    <td className="p-3 text-center align-top">
                                        <button
                                            onClick={() => {
                                                setDeleteSlug(blog.slug);
                                                setShowDeleteModal(true);
                                            }}
                                            className="text-red-500 hover:text-red-700 flex items-center justify-center bg-red-50 px-4 py-2 rounded-lg shadow-sm"
                                        >
                                            <FaTrashAlt size={18} className="mr-1" />
                                            <span>Delete</span>
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
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-4 py-2 rounded ${
                                        currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

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