'use client'; // Ensure this is a client-side component
import { useSession } from 'next-auth/react';

import TestimonialStatistics from '@/app/Dashboard/AdminDashboard/TestimonialStatistics/TestimonialStatistics';

export default function AdminDashboardPage() {
    const { data: session } = useSession();

  if (session?.user.role !== "admin") {
    return <div>You are not authorized to view this page.</div>;
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