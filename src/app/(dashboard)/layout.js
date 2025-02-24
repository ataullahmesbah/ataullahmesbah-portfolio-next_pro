'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect if user is not authenticated
    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    // Show loading state while checking session
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {children}
        </div>
    );
}