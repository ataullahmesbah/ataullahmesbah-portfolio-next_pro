"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import AffiliateStatus from '@/app/components/Affiliate/AffiliateStatus/AffiliateStatus';
import AffiliateApplyForm from '@/app/components/Affiliate/AffiliateApplyForm/AffiliateApplyForm';

export default function AffiliatePage() {
    const { data: session, status } = useSession();
    const [affiliate, setAffiliate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated') {
            fetchAffiliateStatus();
        } else {
            setLoading(false); // No need to load for unauthenticated users
        }
    }, [status]);

    const fetchAffiliateStatus = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/affiliate/user');
            const data = await res.json();
            console.log('Fetch affiliate status response:', data); // Debug
            if (res.ok) {
                setAffiliate(data.affiliate);
                if (data.affiliate?.status === 'approved') {
                    toast.success(
                        <div className="text-center">
                            <p className="font-bold">Affiliate Approved!</p>
                            <p className="text-sm">Your affiliate dashboard is now active</p>
                        </div>,
                        {
                            duration: 5000,
                            position: 'top-center',
                            style: {
                                background: '#1F2937',
                                color: '#fff',
                                border: '1px solid #4B5563',
                            },
                        }
                    );
                }
            } else {
                throw new Error(data.message || 'Failed to fetch status');
            }
        } catch (error) {
            console.error('Fetch affiliate status error:', error);
            toast.error(error.message, {
                position: 'top-center',
                style: {
                    background: '#1F2937',
                    color: '#fff',
                    border: '1px solid #4B5563',
                },
            });
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading affiliate program...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-4">
                        Join Our Affiliate Program
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        Earn 8% commission on every sale by promoting our premium services like SEO, web development, and more.
                    </p>
                    {status === 'unauthenticated' ? (
                        <div className="flex justify-center gap-4">
                            <Link
                                href="/login?callbackUrl=/affiliate"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:shadow-lg transition-all duration-300"
                            >
                                Login to Apply
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center px-6 py-3 bg-gray-700 rounded-lg font-medium text-white hover:bg-gray-600 transition-all duration-300"
                            >
                                Register
                            </Link>
                        </div>
                    ) : (
                        <p className="text-gray-400">
                            {affiliate ? 'Check your affiliate status below' : 'Apply now to start earning!'}
                        </p>
                    )}
                </motion.div>
            </section>

            {/* Affiliate Form/Status for Authenticated Users */}
            {status === 'authenticated' && (
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 p-8 shadow-2xl"
                    >
                        {affiliate ? (
                            <AffiliateStatus affiliate={affiliate} />
                        ) : (
                            <AffiliateApplyForm onApply={fetchAffiliateStatus} />
                        )}
                    </motion.div>
                </section>
            )}

            {/* Benefits Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold text-white mb-8">Why Join Our Affiliate Program?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'High Commissions',
                                description: 'Earn 8% on every sale, with no earning caps.',
                                icon: '💸',
                            },
                            {
                                title: 'Trusted Brand',
                                description: 'Promote premium services from Ataullah Mesbah.',
                                icon: '🏆',
                            },
                            {
                                title: 'Easy Tracking',
                                description: 'Get a unique link and real-time analytics.',
                                icon: '📊',
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 * index }}
                                className="bg-gray-800/50 p-6 rounded-lg border border-gray-700"
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* How It Works Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold text-white mb-8">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Sign Up',
                                description: 'Apply to our affiliate program and get approved.',
                                icon: '📝',
                            },
                            {
                                title: 'Share Your Link',
                                description: 'Get your unique affiliate link to share.',
                                icon: '🔗',
                            },
                            {
                                title: 'Earn Commissions',
                                description: 'Get 8% commission on every sale you refer.',
                                icon: '💰',
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 * index }}
                                className="bg-gray-800/50 p-6 rounded-lg border border-gray-700"
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            {
                                question: 'How much can I earn?',
                                answer: 'You earn an 8% commission on every sale made through your affiliate link, with no upper limit.',
                            },
                            {
                                question: 'How do I get paid?',
                                answer: 'Payments are processed monthly via bank transfer or other methods, depending on your region.',
                            },
                            {
                                question: 'Do I need a website to join?',
                                answer: 'No, you can promote your link on social media, blogs, or any platform.',
                            },
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 * index }}
                                className="bg-gray-800/50 p-6 rounded-lg border border-gray-700"
                            >
                                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                                <p className="text-gray-400">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Call to Action for Unauthenticated Users */}
            {status === 'unauthenticated' && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Ready to Start Earning?
                        </h2>
                        <p className="text-gray-200 mb-6">
                            Join our affiliate program today and start earning commissions!
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link
                                href="/login?callbackUrl=/affiliate"
                                className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300"
                            >
                                Login to Apply
                            </Link>
                            <Link
                                href="/register"
                                className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-all duration-300"
                            >
                                Register
                            </Link>
                        </div>
                    </motion.div>
                </section>
            )}
        </div>
    );
}