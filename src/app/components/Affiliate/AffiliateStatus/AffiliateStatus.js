'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi';

export default function AffiliateStatus({ affiliate }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const link = `https://ataullahmesbah.com/?aff=${affiliate.affiliateCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success(
            <div className="flex items-center">
                <FiCheck className="mr-2 text-green-400" />
                <span>Link copied to clipboard!</span>
            </div>,
            {
                position: 'top-center',
                style: {
                    background: '#1F2937',
                    color: '#fff',
                    border: '1px solid #4B5563'
                }
            }
        );
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusBadge = () => {
        switch (affiliate.status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/30 text-green-400 border border-green-800">
                        Approved
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-800">
                        Pending Approval
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-900/30 text-red-400 border border-red-800">
                        Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 shadow-xl overflow-hidden"
        >
            <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-white">Affiliate Dashboard</h2>
                    {getStatusBadge()}
                </div>

                {affiliate.status === 'pending' && (
                    <div className="space-y-4">
                        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                            <h3 className="text-lg font-medium text-white mb-2">Application Submitted</h3>
                            <p className="text-gray-300">
                                Your affiliate application is under review. We'll notify you once it's processed.
                                This typically takes 1-2 business days.
                            </p>
                        </div>
                    </div>
                )}

                {affiliate.status === 'rejected' && (
                    <div className="space-y-4">
                        <div className="bg-red-900/20 rounded-lg p-4 border border-red-800">
                            <h3 className="text-lg font-medium text-white mb-2">Application Rejected</h3>
                            <p className="text-gray-300">
                                Unfortunately, your affiliate application was not approved at this time.
                                You may contact support for more information.
                            </p>
                        </div>
                    </div>
                )}

                {affiliate.status === 'approved' && (
                    <div className="space-y-6">
                        <div className="bg-green-900/20 rounded-lg p-4 border border-green-800">
                            <h3 className="text-lg font-medium text-white mb-2">Welcome to the Program!</h3>
                            <p className="text-gray-300">
                                Your affiliate account is active. Start sharing your link to earn commissions!
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-white mb-3">Your Affiliate Link</h3>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        value={`https://ataullahmesbah.com/?aff=${affiliate.affiliateCode}`}
                                        readOnly
                                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-16"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="absolute right-2 top-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-md text-sm flex items-center transition-colors"
                                    >
                                        {copied ? (
                                            <>
                                                <FiCheck className="mr-1" /> Copied
                                            </>
                                        ) : (
                                            <>
                                                <FiCopy className="mr-1" /> Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                                {/* <a
                                    href={`/dashboard/affiliate`}
                                    className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <FiExternalLink /> Dashboard
                                </a> */}
                            </div>
                            <p className="text-gray-400 text-sm mt-2">
                                Earn <span className="text-purple-400 font-medium">8% commission</span> on every sale made through your link
                            </p>
                        </div>

                        <div className="mt-6 grid md:grid-cols-2 gap-4">
                            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                                <h4 className="font-medium text-white mb-2">Commission Rate</h4>
                                <p className="text-2xl font-bold text-purple-400">8%</p>
                                <p className="text-gray-400 text-sm mt-1">per successful referral</p>
                            </div>
                            <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                                <h4 className="font-medium text-white mb-2">Cookie Duration</h4>
                                <p className="text-2xl font-bold text-blue-400">30 days</p>
                                <p className="text-gray-400 text-sm mt-1">tracking period</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}