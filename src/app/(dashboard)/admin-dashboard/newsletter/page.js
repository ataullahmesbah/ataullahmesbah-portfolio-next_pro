// src/app/admin/newsletter/page.js
"use client";

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaCheckCircle, FaClock, FaTimesCircle, FaUsers, FaSearch, FaSyncAlt } from 'react-icons/fa';

const NewsletterAdmin = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const subscribersPerPage = 10;

    // Fetch subscribers
    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/newsletter', {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setSubscribers(data.subscribers);
            } else {
                toast.error(data.error || 'Failed to fetch subscribers');
            }
        } catch (error) {
            toast.error('Error fetching subscribers');
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats
    const fetchStats = async () => {
        try {
            const res = await fetch('/api/newsletter/stats', {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setStats(data.stats);
            } else {
                toast.error(data.error || 'Failed to fetch stats');
            }
        } catch (error) {
            toast.error('Error fetching stats');
        }
    };

    // Delete subscriber
    const handleDelete = async (email) => {
        if (!confirm(`Are you sure you want to delete ${email}?`)) return;

        try {
            const res = await fetch('/api/newsletter', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`
                },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Subscriber deleted successfully');
                fetchSubscribers(); // Refresh list
            } else {
                toast.error(data.error || 'Failed to delete subscriber');
            }
        } catch (error) {
            toast.error('Error deleting subscriber');
        }
    };

    // Refresh data
    const handleRefresh = () => {
        fetchSubscribers();
        fetchStats();
        toast.success('Data refreshed successfully');
    };

    useEffect(() => {
        fetchSubscribers();
        fetchStats();
    }, []);

    // Search and filter subscribers
    const filteredSubscribers = subscribers.filter(subscriber =>
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subscriber.name && subscriber.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (subscriber.country && subscriber.country.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Pagination logic
    const indexOfLastSubscriber = currentPage * subscribersPerPage;
    const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage;
    const currentSubscribers = filteredSubscribers.slice(indexOfFirstSubscriber, indexOfLastSubscriber);
    const totalPages = Math.ceil(filteredSubscribers.length / subscribersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6 md:p-10">
            <Toaster position="top-center" />

            {/* Header Section */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-normal tracking-tight text-shadow-md">
                    Newsletter Admin Panel
                </h1>
                <button
                    onClick={handleRefresh}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
                >
                    <FaSyncAlt className="mr-2" />
                    Refresh
                </button>
            </div>

            {/* Statistics Section */}
            {stats && (
                <div className="mb-12 p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg border border-gray-700">
                    <h2 className="text-2xl font-normal mb-6 text-gray-100 tracking-wide">Statistics</h2>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-xl backdrop-blur-md text-center transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                            <div className="flex justify-center items-center space-x-3">
                                <FaUsers className="w-10 h-10 text-orange-500" />
                                <div>
                                    <p className="text-sm font-normal text-gray-300">Total Subscribers</p>
                                    <p className="text-3xl font-normal text-orange-500">{stats.totalSubscribers}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-md text-center transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                            <div className="flex justify-center items-center space-x-3">
                                <FaCheckCircle className="w-10 h-10 text-green-500" />
                                <div>
                                    <p className="text-sm font-normal text-gray-300">Synced with Brevo</p>
                                    <p className="text-3xl font-normal text-green-500">{stats.syncedSubscribers}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-md text-center transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                            <div className="flex justify-center items-center space-x-3">
                                <FaTimesCircle className="w-10 h-10 text-red-500" />
                                <div>
                                    <p className="text-sm font-normal text-gray-300">Unsynced</p>
                                    <p className="text-3xl font-normal text-red-500">{stats.unsyncedSubscribers}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl backdrop-blur-md text-center transform hover:scale-105 hover:shadow-xl transition-all duration-300">
                            <div className="flex justify-center items-center space-x-3">
                                <FaClock className="w-10 h-10 text-purple-500" />
                                <div>
                                    <p className="text-sm font-normal text-gray-300">Recent (Last 7 Days)</p>
                                    <p className="text-3xl font-normal text-purple-500">{stats.recentSubscribers}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Country Distribution */}
                    <h3 className="text-xl font-normal mt-8 mb-4 text-gray-100 tracking-wide">Country Distribution</h3>
                    {stats.countryDistribution && stats.countryDistribution.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stats.countryDistribution.map((country) => (
                                <div
                                    key={country._id}
                                    className="p-6 bg-sky-500/10 border border-sky-500/20 rounded-xl backdrop-blur-md text-center transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-normal text-gray-200">{country._id}</span>
                                        <span className="text-lg font-normal text-gray-100 bg-gray-600/10 border-gray-500/20 border px-3 py-1 rounded-full">
                                            {country.count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No country distribution data available.</p>
                    )}
                </div>
            )}

            {/* Subscriber List */}
            <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-normal text-gray-100 tracking-wide">Subscribers</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search subscribers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FaSearch className="absolute right-3 top-3 text-gray-400" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-t-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                    </div>
                ) : subscribers.length === 0 ? (
                    <p className="text-gray-400">No subscribers found.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-700 sticky top-0">
                                    <tr>
                                        <th className="p-4 text-gray-200">Email</th>
                                        <th className="p-4 text-gray-200">Name</th>
                                        <th className="p-4 text-gray-200">IP Address</th>
                                        <th className="p-4 text-gray-200">Country</th>
                                        <th className="p-4 text-gray-200">Subscribed At</th>
                                        <th className="p-4 text-gray-200">Brevo Synced</th>
                                        <th className="p-4 text-gray-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentSubscribers.map((subscriber, index) => (
                                        <tr
                                            key={subscriber._id}
                                            className={`border-t border-gray-700 ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'}`}
                                        >
                                            <td className="p-4">{subscriber.email}</td>
                                            <td className="p-4">{subscriber.name || '-'}</td>
                                            <td className="p-4">{subscriber.ipAddress || 'Unknown'}</td>
                                            <td className="p-4">{subscriber.country || 'Unknown'}</td>
                                            <td className="p-4">{new Date(subscriber.subscribedAt).toLocaleString()}</td>
                                            <td className="p-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-sm ${subscriber.brevoSynced
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : 'bg-red-500/20 text-red-400'
                                                        }`}
                                                >
                                                    {subscriber.brevoSynced ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDelete(subscriber.email)}
                                                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredSubscribers.length > subscribersPerPage && (
                            <div className="flex justify-center mt-6">
                                <div className="flex space-x-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 rounded-lg ${currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                } transition-all duration-300`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsletterAdmin;