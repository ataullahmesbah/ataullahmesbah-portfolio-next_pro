"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AffiliateStatus({ affiliate }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://ataullahmesbah.com/?aff=${affiliate.affiliateCode}`);
        setCopied(true);
        toast.success('Affiliate link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto text-white">
            <h2 className="text-xl font-semibold mb-4">Affiliate Status</h2>
            {affiliate.status === 'pending' && (
                <p className="text-gray-300">Your affiliate request is pending approval.</p>
            )}
            {affiliate.status === 'rejected' && (
                <p className="text-red-400">Your affiliate request was rejected. Please contact support.</p>
            )}
            {affiliate.status === 'approved' && (
                <div>
                    <p className="text-green-400 mb-2">Congratulations! Your affiliate request is approved.</p>
                    <p className="text-gray-300 mb-2">Your affiliate link:</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={`https://ataullahmesbah.com/?aff=${affiliate.affiliateCode}`}
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
                    <p className="text-gray-400 text-sm mt-2">Share this link to earn 8% commission on sales!</p>
                </div>
            )}
        </div>
    );
}