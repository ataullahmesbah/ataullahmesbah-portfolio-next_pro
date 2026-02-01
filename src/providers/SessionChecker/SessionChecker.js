// components/SessionChecker/SessionChecker.jsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { showErrorToast } from '@/app/components/Share/toastConfig/toastConfig';


export default function SessionChecker() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const checkForceLogout = async () => {
            // Only check if session exists and not already checked
            if (session?.user?.id && !checked) {
                try {
                    const response = await fetch('/api/auth/check-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: session.user.id }),
                    });

                    if (response.ok) {
                        const data = await response.json();

                        if (data.forceLogout) {
                            showErrorToast('Your session has been terminated by admin. Please login again.');

                            // Sign out user
                            await fetch('/api/auth/signout', { method: 'POST' });

                            // Redirect to login
                            router.push('/login');
                        }
                    }
                } catch (error) {
                    console.error('Session check error:', error);
                } finally {
                    setChecked(true);
                }
            }
        };

        // Check for session errors
        if (session?.error) {
            if (session.error.includes('Force logout by admin') ||
                session.error.includes('session terminated') ||
                session.error.includes('terminated by admin')) {

                showErrorToast('Your session was terminated. Please login again.');

                setTimeout(async () => {
                    await fetch('/api/auth/signout', { method: 'POST' });
                    router.push('/login');
                }, 2000);
            }
        } else if (status === 'authenticated') {
            // Check force logout status
            checkForceLogout();
        }

        // Reset checked status when session changes
        if (status === 'unauthenticated') {
            setChecked(false);
        }
    }, [session, status, router, checked, update]);

    return null;
}