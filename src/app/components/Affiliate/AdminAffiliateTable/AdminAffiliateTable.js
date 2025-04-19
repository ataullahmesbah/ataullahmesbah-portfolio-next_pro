"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminAffiliateTable({ affiliates, onUpdate }) {
    const [loading, setLoading] = useState({});

    const handleManage = async (id, status) => {
        setLoading((prev) => ({ ...prev, [id]: true }));
        try {
            const res = await fetch('/api/affiliate/manage', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            const data = await res.json();
            console.log('Manage affiliate response:', data); // Debug response
            if (res.ok) {
                toast.success(`Affiliate ${status}`);
                onUpdate();
            } else {
                toast.error(data.message || 'Failed to manage affiliate');
            }
        } catch (error) {
            console.error('Manage affiliate error:', error);
            toast.error('Error managing affiliate');
        } finally {
            setLoading((prev) => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {affiliates.map((affiliate) => (
                        <tr key={affiliate._id} className="hover:bg-gray-700">
                            <td className="px-6 py-4 text-sm text-white">{affiliate.userId?.username || 'Unknown'}</td>
                            <td className="px-6 py-4 text-sm text-white">{affiliate.status}</td>
                            <td className="px-6 py-4 text-sm flex gap-2">
                                {affiliate.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleManage(affiliate._id, 'approved')}
                                            disabled={loading[affiliate._id]}
                                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleManage(affiliate._id, 'rejected')}
                                            disabled={loading[affiliate._id]}
                                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}