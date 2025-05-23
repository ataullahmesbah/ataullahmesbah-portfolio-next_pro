'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

const AllSEOPackages = () => {
    const [packages, setPackages] = useState([]);
    const [filteredPackages, setFilteredPackages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPackages = async () => {
        try {
            const res = await fetch('/api/services/seopack', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch packages');
            const data = await res.json();
            setPackages(data);
            setFilteredPackages(data);
        } catch (error) {
            toast.error('Failed to load packages');
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = packages.filter(
            (pkg) =>
                pkg.name.toLowerCase().includes(query) ||
                pkg.description.toLowerCase().includes(query) ||
                pkg.features.some((f) => f.toLowerCase().includes(query))
        );
        setFilteredPackages(filtered);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this package?')) return;
        try {
            const res = await fetch(`/api/services/seopack?id=${id}`, {
                method: 'DELETE',
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to delete package');
            toast.success('Package deleted successfully');
            fetchPackages();
        } catch (error) {
            toast.error(`Failed to delete package: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-white mb-8 text-center"
                >
                    All SEO Packages
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg"
                >
                    <div className="mb-6">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search by name, description, or feature..."
                            className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-200">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Discount</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPackages.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-center text-gray-400">
                                            No packages found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPackages.map((pkg) => (
                                        <tr key={pkg._id} className="border-b border-gray-700">
                                            <td className="p-4">{pkg.name}</td>
                                            <td className="p-4">{pkg.description}</td>
                                            <td className="p-4">${pkg.price.toLocaleString()}</td>
                                            <td className="p-4">${pkg.discount.toLocaleString()}</td>
                                            <td className="p-4 flex gap-2">
                                                <Link
                                                    href="/seo"
                                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/admin-dashboard/services/seo-packages/edit/${pkg._id}`}
                                                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                >
                                                    Update
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(pkg._id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AllSEOPackages;