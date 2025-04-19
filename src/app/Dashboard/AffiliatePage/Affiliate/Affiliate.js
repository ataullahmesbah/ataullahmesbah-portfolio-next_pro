"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AdminAffiliateTable from '@/app/components/Affiliate/AdminAffiliateTable/AdminAffiliateTable';


export default function AdminAffiliatesPage() {
    const { data: session, status } = useSession();
    const [affiliates, setAffiliates] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const fetchAffiliates = async () => {
        try {
            const res = await fetch('/api/affiliate/list');
            const data = await res.json();
            console.log('Fetch affiliates response:', data); // Debug response
            if (res.ok) {
                setAffiliates(data);
            } else {
                toast.error(data.message || 'Failed to fetch affiliates');
            }
        } catch (error) {
            console.error('Fetch affiliates error:', error);
            toast.error('Error fetching affiliates');
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
                    Manage Affiliates
                </h1>
                <AdminAffiliateTable affiliates={affiliates} onUpdate={fetchAffiliates} />
            </div>
        </div>
    );
}