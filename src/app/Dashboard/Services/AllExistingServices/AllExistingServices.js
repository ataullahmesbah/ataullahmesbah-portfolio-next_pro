'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

const AllExistingServices = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch services
    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services/seo', {
                cache: 'no-store',
            });
            if (!res.ok) throw new Error('Failed to fetch services');
            const data = await res.json();
            setServices(data);
            setFilteredServices(data);
        } catch (error) {
            toast.error('Failed to load services');
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Handle search
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = services.filter(
            (service) =>
                service.category.toLowerCase().includes(query) ||
                service.services.some((s) => s.name.toLowerCase().includes(query))
        );
        setFilteredServices(filtered);
    };

    // Delete service
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            const res = await fetch(`/api/services/seo?id=${id}`, {
                method: 'DELETE',
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to delete service');
            toast.success('Service deleted successfully');
            fetchServices();
        } catch (error) {
            toast.error(`Failed to delete service: ${error.message}`);
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
                    All Existing Services
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg"
                >
                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search by category or service name..."
                            className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    {/* Service Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-gray-200">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Service Names</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServices.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="p-4 text-center text-gray-400">
                                            No services found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredServices.map((service) => (
                                        <tr key={service._id} className="border-b border-gray-700">
                                            <td className="p-4">{service.category}</td>
                                            <td className="p-4">
                                                {service.services.map((s) => s.name).join(', ')}
                                            </td>
                                            <td className="p-4 flex gap-2">
                                                <Link
                                                    href="/seo"
                                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/admin-dashboard/services/edit/${service._id}`}
                                                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                                >
                                                    Update
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(service._id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-600"
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

export default AllExistingServices;