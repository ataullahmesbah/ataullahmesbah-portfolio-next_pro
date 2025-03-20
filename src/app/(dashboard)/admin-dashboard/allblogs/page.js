'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaEye, FaTrashAlt } from 'react-icons/fa'; // Import icons
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

export default function AllBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 8; // Show 8 blogs per page

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
    const deleteBlog = async (slug) => {
        const res = await fetch(`/api/blog?slug=${slug}`, { method: 'DELETE' });

        if (res.ok) {
            setBlogs(blogs.filter(blog => blog.slug !== slug));
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
                <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-800 text-left">
                                <th className="p-3">#</th>
                                <th className="p-3">Title</th>
                                <th className="p-3">Author</th>
                                <th className="p-3 text-center">Actions</th>
                                <th className="p-3 text-center">DELETE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBlogs.map((blog, index) => (
                                <tr key={blog.slug} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{indexOfFirstBlog + index + 1}</td>
                                    <td className="p-3">{blog.title}</td>
                                    <td className="p-3">{blog.writer}</td>
                                    <td className="p-3 text-center">
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="text-blue-500 hover:text-blue-700 mr-4 flex items-center justify-center"
                                        >
                                            <FaEye size={18} className="mr-1" />
                                            <span>View</span>
                                        </Link>

                                    </td>

                                    <td className="p-3  text-center">
                                        <button
                                            onClick={() => deleteBlog(blog.slug)}
                                            className="text-red-500 hover:text-red-700 flex items-center justify-center"
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
                                    className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
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
            </div>
        </div>
    );
}