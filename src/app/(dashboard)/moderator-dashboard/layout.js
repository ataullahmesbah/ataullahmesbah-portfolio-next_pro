'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ModeratorDashboardLayout({ children }) {
    const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if user is not authenticated or not a moderator
  if (status === 'unauthenticated' || session?.user?.role !== 'moderator') {
    router.push('/');
    return null;
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

    return (
        <div className="flex h-screen bg-gray-200">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white p-6 shadow-lg">
            <p>Hello, {session.user.name}!</p>
                <h2 className="text-2xl font-semibold mb-6 text-center">Moderator Dashboard</h2>
                <nav>
                    

                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
                <h1 className="font-semibold text-2xl">Moderator Dashboard</h1>
                {children}
            </main>
        </div>
    );
}
