"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AffiliateDashboard from '@/app/components/Affiliate/AffiliateDashboard/AffiliateDashboard';


export default function AffiliateDashboardPage() {
    const { data: session, status } = useSession();
    const [data, setData] = useState({ affiliate: null, transactions: [] });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated') {
            fetchAffiliateData();
        }
    }, [status, router]);

    const fetchAffiliateData = async () => {
        try {
            const res = await fetch('/api/affiliate/user');
            const data = await res.json();
          
            if (res.ok) {
                setData(data);
                if (data.affiliate?.status === 'approved') {
                    toast.success('Your affiliate link is ready! Share it to start earning.', {
                        duration: 5000,
                    });
                }
            } else {
                toast.error(data.message || 'Failed to fetch affiliate data');
            }
        } catch (error) {
            console.error('Fetch affiliate data error:', error);
            toast.error('Error fetching affiliate data');
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
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                    Affiliate Dashboard
                </h1>
                <AffiliateDashboard data={data} />
            </div>
        </div>
    );
}