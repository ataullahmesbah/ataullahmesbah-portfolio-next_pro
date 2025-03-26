// src/app/newsletterinfo/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const NewsletterInfoPage = () => {
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNewsletters = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/newsletter/letter');
            const data = await res.json();
            setNewsletters(data);
        } catch (error) {
            toast.error('Error fetching newsletters');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsletters();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this newsletter?')) return;

        try {
            const res = await fetch(`/api/newsletter/letter?id=${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Newsletter deleted successfully');
                fetchNewsletters();
            } else {
                toast.error(data.error || 'Failed to delete newsletter');
            }
        } catch (error) {
            toast.error('Error deleting newsletter');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6 md:p-10">
            <Toaster position="top-center" />
            <h1 className="text-4xl font-normal tracking-tight text-shadow-md mb-10 text-center">
                Newsletter Info
            </h1>

            {newsletters.length === 0 ? (
                <p className="text-center text-gray-400 text-lg">No newsletters found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700 sticky top-0">
                            <tr>
                                <th className="p-4 text-gray-200">Title</th>
                                <th className="p-4 text-gray-200">Category</th>
                                <th className="p-4 text-gray-200">Author</th>
                                <th className="p-4 text-gray-200">Publish Date</th>
                                <th className="p-4 text-gray-200">Views</th>
                                <th className="p-4 text-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newsletters.map((newsletter, index) => (
                                <tr
                                    key={newsletter._id}
                                    className={`border-t border-gray-700 ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'}`}
                                >
                                    <td className="p-4">{newsletter.title}</td>
                                    <td className="p-4">{newsletter.category}</td>
                                    <td className="p-4">{newsletter.author}</td>
                                    <td className="p-4">{new Date(newsletter.publishDate).toLocaleDateString()}</td>
                                    <td className="p-4">{newsletter.views}</td>
                                    <td className="p-4 flex space-x-3">
                                        <Link href={`/newsletter/${newsletter.slug}`}>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                                                View
                                            </button>
                                        </Link>
                                        <Link href={`/admin-dashboard/newsletter/edit/${newsletter._id}`}>
                                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300">
                                                Update
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(newsletter._id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default NewsletterInfoPage;