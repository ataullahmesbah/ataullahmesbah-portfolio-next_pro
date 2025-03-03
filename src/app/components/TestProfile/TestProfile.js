'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <div className="flex items-center gap-4">
            {session?.user?.image ? (
                <Image src={session.user.image} alt="Profile" className="w-10 h-10 rounded-full" />
            ) : (
                <i className="fas fa-user-circle text-3xl" />
            )}
        </div>
    );
}
