'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AffiliateApplyForm({ onApply }) {
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!agreed) {
            toast.error('You must agree to the terms and conditions', {
                position: 'top-center',
                style: {
                    background: '#1F2937',
                    color: '#fff',
                    border: '1px solid #4B5563'
                }
            });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/affiliate/apply', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success(
                    <div className="text-center">
                        <p className="font-bold">Application Submitted!</p>
                        <p className="text-sm">We'll review your application shortly</p>
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
                onApply();
            } else {
                throw new Error(data.message || 'Failed to submit application');
            }
        } catch (error) {
            toast.error(error.message, {
                position: 'top-center',
                style: {
                    background: '#1F2937',
                    color: '#fff',
                    border: '1px solid #4B5563'
                }
            });
            console.error('Application error:', error);
        } finally {
            setLoading(false);
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
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Join Our Affiliate Program</h2>
                    <p className="text-gray-300">Earn 8% commission on every sale you refer</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                        <h3 className="text-lg font-medium text-white mb-3">Program Benefits</h3>
                        <ul className="space-y-3">
                            {[
                                "8% commission on all referred sales",
                                "30-day cookie tracking",
                                "Real-time analytics dashboard",
                                "Monthly payouts via PayPal or bank transfer",
                                "Marketing materials provided"
                            ].map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                    <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-300">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-600 rounded bg-gray-700"
                                />
                            </div>
                            <div className="ml-3">
                                <label htmlFor="terms" className="text-sm text-gray-300">
                                    I agree to the <a href="/affiliate/terms" className="text-purple-400 hover:text-purple-300">Affiliate Program Terms</a> and confirm that all information provided is accurate
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading || !agreed}
                                className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 ${
                                    loading || !agreed
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    'Apply to Become an Affiliate'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
}