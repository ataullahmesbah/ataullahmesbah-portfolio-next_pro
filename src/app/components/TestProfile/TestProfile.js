'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const TestProfile = () => {
    const { data: session } = useSession();

    return (
        <div>
            {session ? (
                <div>
                    <p>Welcome, {session.user.name}</p>
                    {session.user.image ? (
                        <Image src={session.user.image} width={100} height={100} alt="Profile" />
                    ) : (
                        <p>No Profile Image</p>
                    )}
                </div>
            ) : (
                <p>Please Login</p>
            )}
        </div>
    );
};

export default TestProfile;
