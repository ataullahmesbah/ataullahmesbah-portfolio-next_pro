'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TestimonialStatistics from '@/app/Dashboard/AdminDashboard/TestimonialStatistics/TestimonialStatistics';
import { FaBell } from 'react-icons/fa';

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
        <main className="min-h-screen bg-gray-800">
            <div className="space-y-6 py-10">
                <div className="text-white px-5 space-y-3">
                    <h2 className="text-3xl font-bold">Welcome back!</h2>
                    <div className="flex gap-4 items-center">
                        <FaBell />
                        <p>Hello, our wonderful friend! May your day be filled with laughter, love, and all things amazing!</p>
                    </div>
                </div>
                <div className="mt-10">
                    <TestimonialStatistics />
                </div>
            </div>
        </main>
    );
}