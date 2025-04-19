"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AffiliateDashboard({ data }) {
    const { affiliate, transactions } = data;
    const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (affiliate?.affiliateCode) {
            navigator.clipboard.writeText(`https://ataullahmesbah.com/?aff=${affiliate.affiliateCode}`);
            setCopied(true);
            toast.success('Affiliate link copied!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            {affiliate?.status === 'approved' ? (
                <>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-white">Your Affiliate Link</h2>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={affiliate.affiliateCode ? `https://ataullahmesbah.com/?aff=${affiliate.affiliateCode}` : ''}
                                readOnly
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none"
                            />
                            <button
                                onClick={handleCopy}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">Share this link to earn 8% commission!</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-white">Earnings</h2>
                        <p className="text-2xl font-bold text-green-400">৳{totalCommission.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-white">Transaction History</h2>
                        {transactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead className="bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Commission</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {transactions.map((t) => (
                                            <tr key={t._id} className="hover:bg-gray-700">
                                                <td className="px-6 py-4 text-sm text-white">{t.productId?.name || 'Unknown'}</td>
                                                <td className="px-6 py-4 text-sm text-white">৳{t.amount}</td>
                                                <td className="px-6 py-4 text-sm text-white">৳{t.commission.toFixed(2)}</td>
                                                <td className="px-6 py-4 text-sm text-white">
                                                    {new Date(t.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-400">No transactions yet. Start sharing your affiliate link!</p>
                        )}
                    </div>
                </>
            ) : (
                <p className="text-gray-300">Your affiliate request is {affiliate?.status || 'not submitted'}.</p>
            )}
        </div>
    );
}