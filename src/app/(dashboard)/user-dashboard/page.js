'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UserPage() {
    const { data: session } = useSession();
    const router = useRouter();

    if (!session || session.user.role !== 'user') {
        router.push('/login');
        return null;
    }

    return <div>User Dashboard</div>;
}