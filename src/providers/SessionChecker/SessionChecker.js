// components/SessionChecker/SessionChecker.jsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { showErrorToast } from '@/app/components/Share/toastConfig/toastConfig';

export default function SessionChecker() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.error) {
            if (session.error.includes('Force logout by admin') ||
                session.error.includes('session terminated')) {

                showErrorToast('Your session was terminated. Please login again.');

                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        }
    }, [session, router]);

    return null;
}