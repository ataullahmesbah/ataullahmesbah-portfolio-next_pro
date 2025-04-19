"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import AffiliateStatus from '@/app/components/Affiliate/AffiliateStatus/AffiliateStatus';
import AffiliateApplyForm from '@/app/components/Affiliate/AffiliateApplyForm/AffiliateApplyForm';

export default function AffiliatePage() {
    const { data: session, status } = useSession();
    const [affiliate, setAffiliate] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated') {
            fetchAffiliateStatus();
        }
    }, [status, router]);

    const fetchAffiliateStatus = async () => {
        try {
            const res = await fetch('/api/affiliate/user');
            const data = await res.json();
            console.log('Affiliate status response:', data); // Debug response
            if (res.ok) {
                setAffiliate(data.affiliate);
                if (data.affiliate?.status === 'approved') {
                    toast.success('Your affiliate request is approved! Check your link below or visit the dashboard.', {
                        duration: 5000,
                    });
                }
            } else {
                toast.error(data.message || 'Failed to fetch affiliate status');
            }
        } catch (error) {
            console.error('Fetch affiliate status error:', error);
            toast.error('Error fetching affiliate status');
        } finally {
            setLoading(false);
        }
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
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                    Affiliate Program
                </h1>
                {affiliate ? (
                    <>
                        <AffiliateStatus affiliate={affiliate} />
                        {affiliate.status === 'approved' && (
                            <p className="mt-4 text-gray-300">
                                Manage your affiliate link and earnings in the{' '}
                                <Link href="/dashboard/affiliate" className="text-purple-400 hover:text-purple-300">
                                    Affiliate Dashboard
                                </Link>.
                            </p>
                        )}
                    </>
                ) : (
                    <AffiliateApplyForm onApply={fetchAffiliateStatus} />
                )}
            </div>
        </div>
    );
}