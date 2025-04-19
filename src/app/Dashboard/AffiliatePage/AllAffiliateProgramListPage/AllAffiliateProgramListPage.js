"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AllAffiliateProgramListPage() {
    const { data: session, status } = useSession();
    const [affiliates, setAffiliates] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedAffiliate, setSelectedAffiliate] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && session.user.role !== 'admin')) {
            router.push('/');
            return;
        }
        if (status === 'authenticated') {
            fetchAffiliates();
        }
    }, [status, session, router]);

    const fetchAffiliates = async (searchTerm = '') => {
        try {
            const res = await fetch(`/api/affiliate/all${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`);
            const data = await res.json();
            console.log('Fetch all affiliates response:', data); // Debug
            if (res.ok) {
                setAffiliates(data);
            } else {
                toast.error(data.message || 'Failed to fetch affiliates');
            }
        } catch (error) {
            console.error('Fetch all affiliates error:', error);
            toast.error('Error fetching affiliates');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        fetchAffiliates(search);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this affiliate?')) return;
        try {
            const res = await fetch('/api/affiliate/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            console.log('Delete affiliate response:', data); // Debug
            if (res.ok) {
                toast.success('Affiliate deleted successfully');
                fetchAffiliates(search); // Refresh list
            } else {
                toast.error(data.message || 'Failed to delete affiliate');
            }
        } catch (error) {
            console.error('Delete affiliate error:', error);
            toast.error('Error deleting affiliate');
        }
    };

    const handleViewDetails = async (id) => {
        try {
            const res = await fetch(`/api/affiliate/user?id=${id}`);
            const data = await res.json();
            console.log('Affiliate details response:', data); // Debug
            if (res.ok) {
                setSelectedAffiliate(data);
            } else {
                toast.error(data.message || 'Failed to fetch affiliate details');
            }
        } catch (error) {
            console.error('Fetch affiliate details error:', error);
            toast.error('Error fetching affiliate details');
        }
    };

    const closeModal = () => {
        setSelectedAffiliate(null);
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                    All Affiliate Programs
                </h1>
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by username or email..."
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-md border border-gray-600 focus:outline-none focus:border-purple-500"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                            Search
                        </button>
                    </div>
                </form>
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Username</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Earnings</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Sales</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {affiliates.length > 0 ? (
                                affiliates.map((affiliate) => (
                                    <tr key={affiliate._id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 text-sm text-white">{affiliate.username}</td>
                                        <td className="px-6 py-4 text-sm text-white">{affiliate.email}</td>
                                        <td className="px-6 py-4 text-sm text-white">৳{affiliate.totalEarnings.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-white">{affiliate.totalSales}</td>
                                        <td className="px-6 py-4 text-sm flex gap-2">
                                            <button
                                                onClick={() => handleViewDetails(affiliate.userId)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => handleDelete(affiliate._id)}
                                                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-sm text-gray-400 text-center">
                                        No affiliates found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {selectedAffiliate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
                            <h2 className="text-xl font-semibold mb-4 text-white">Affiliate Details</h2>
                            <p className="text-gray-300 mb-2">
                                <strong>Username:</strong> {selectedAffiliate.affiliate?.userId?.username}
                            </p>
                            <p className="text-gray-300 mb-2">
                                <strong>Email:</strong> {selectedAffiliate.affiliate?.userId?.email}
                            </p>
                            <p className="text-gray-300 mb-2">
                                <strong>Affiliate Link:</strong>{' '}
                                {selectedAffiliate.affiliate?.affiliateCode
                                    ? `https://ataullahmesbah.com/?aff=${selectedAffiliate.affiliate.affiliateCode}`
                                    : 'N/A'}
                            </p>
                            <h3 className="text-lg font-semibold mt-4 mb-2 text-white">Transaction History</h3>
                            {selectedAffiliate.transactions?.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead className="bg-gray-900">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Product</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Amount</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Commission</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {selectedAffiliate.transactions.map((t) => (
                                                <tr key={t._id} className="hover:bg-gray-700">
                                                    <td className="px-4 py-2 text-sm text-white">{t.productId?.name || 'Unknown'}</td>
                                                    <td className="px-4 py-2 text-sm text-white">৳{t.amount}</td>
                                                    <td className="px-4 py-2 text-sm text-white">৳{t.commission.toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-sm text-white">
                                                        {new Date(t.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-400">No transactions yet.</p>
                            )}
                            <button
                                onClick={closeModal}
                                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}