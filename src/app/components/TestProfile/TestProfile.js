'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaUserGraduate } from 'react-icons/fa';

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <div className="bg-gray-900 text-white p-4">
            {session ? (
                <div className="flex items-center space-x-4">
                    {session.user.image ? (
                        <Image
                            src={session.user.image}
                            alt="User Profile"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : (
                        <FaUserGraduate className="text-2xl" />
                    )}
                    <div>
                        <p className="font-bold">{session.user.name}</p>
                        <p className="text-sm text-gray-400">{session.user.email}</p>
                    </div>
                </div>
            ) : (
                <p>Please log in</p>
            )}
        </div>
    );
};

export default Navbar;