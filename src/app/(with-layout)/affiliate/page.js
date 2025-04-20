"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AffiliateStatus from '@/app/components/Affiliate/AffiliateStatus/AffiliateStatus';
import AffiliateApplyForm from '@/app/components/Affiliate/AffiliateApplyForm/AffiliateApplyForm';


export default function AffiliatePage() {
    const { data: session, status } = useSession();
    const [affiliate, setAffiliate] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            toast.loading('Please login to access the affiliate program', {
                duration: 2000,
                position: 'top-center'
            });
            const timer = setTimeout(() => {
                router.push('/login?callbackUrl=/affiliate');
            }, 2000);
            return () => clearTimeout(timer);
        }

        if (status === 'authenticated') {
            fetchAffiliateStatus();
        }
    }, [status, router]);

    const fetchAffiliateStatus = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/affiliate/user');
            const data = await res.json();

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
                                border: '1px solid #4B5563'
                            }
                        }
                    );
                }
            } else {
                throw new Error(data.message || 'Failed to fetch status');
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

    if (status === 'unauthenticated') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 p-8 text-center shadow-2xl"
                >
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">Access Restricted</h2>
                            <p className="text-gray-400">
                                You must be logged in to access the affiliate program
                            </p>
                        </div>
                        <div className="pt-4">
                            <Link
                                href="/login?callbackUrl=/affiliate"
                                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white hover:shadow-lg transition-all duration-300"
                            >
                                Login to Continue
                            </Link>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-purple-400 hover:text-purple-300">
                                Register here
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-4">
                        Affiliate Program
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Earn commissions by promoting our products and services
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center"
                >
                    {affiliate ? (
                        <AffiliateStatus affiliate={affiliate} />
                    ) : (
                        <AffiliateApplyForm onApply={fetchAffiliateStatus} />
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 max-w-3xl mx-auto">
                        <h3 className="text-xl font-semibold text-white mb-3">How It Works</h3>
                        <div className="grid md:grid-cols-3 gap-6 mt-6">
                            {[
                                {
                                    title: "Sign Up",
                                    description: "Apply to our affiliate program and get approved",
                                    icon: "📝"
                                },
                                {
                                    title: "Share Your Link",
                                    description: "Get your unique affiliate link to share",
                                    icon: "🔗"
                                },
                                {
                                    title: "Earn Commissions",
                                    description: "Get 8% commission on every sale you refer",
                                    icon: "💰"
                                }
                            ].map((item, index) => (
                                <div key={index} className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                                    <div className="text-3xl mb-3">{item.icon}</div>
                                    <h4 className="font-medium text-white mb-1">{item.title}</h4>
                                    <p className="text-gray-400 text-sm">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}