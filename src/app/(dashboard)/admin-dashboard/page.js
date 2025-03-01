'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import TestimonialStatistics from '@/app/Dashboard/AdminDashboard/TestimonialStatistics/TestimonialStatistics';

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect if user is not authenticated or not an admin
    if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
        router.push('/');
        return null;
    }

    // Show loading state while checking session
    if (status === 'loading') {
        return <div>Loading...</div>;
    }


    return (
        <main
            className="min-h-screen"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}
        >
            <div className="space-y-6 py-10">
                <h2 className="text-3xl text-center text-white font-bold">Welcome to the Admin Dashboard</h2>
                <div className="mt-10">
                    
                    <TestimonialStatistics />
                </div>
            </div>
        </main>
    );
}