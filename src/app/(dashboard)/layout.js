'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '../loading';
import Head from 'next/head';

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
        return <Loading />;
    }

    return (
        <>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div>
                {children}
            </div>
        </>
    );
}