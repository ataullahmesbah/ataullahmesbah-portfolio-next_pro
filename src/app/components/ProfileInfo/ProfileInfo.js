'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import Link from 'next/link';
import { useRouter } from 'next/navigation';  // For handling redirection

const ProfileInfo = () => {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState(null);
    const router = useRouter();  // Use router for redirecting

    // Redirect unauthenticated users to login page
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            toast.error('Please log in to access your profile.');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (status === 'authenticated' && session?.user?.id) {
                try {
                    const response = await fetch(`/api/profile/${session.user.id}`);
                    const data = await response.json();
                    if (data.profile) {
                        setProfile(data.profile);
                    } else {
                        toast.error('Profile not found');
                    }
                } catch (error) {
                    toast.error('Something went wrong');
                }
            }
        };

        if (status === 'authenticated') {
            fetchProfile();
        }
    }, [status, session]);

    if (!profile) return <div className="bg-gray-800 min-h-screen text-white">No Profile Available</div>;

    return (
        <div className="bg-gray-900 min-h-screen py-10 border-b border-b-gray-700">
            <div className="bg-gray-800 max-w-5xl mx-auto rounded-md py-10">
            <div className="max-w-4xl mx-auto p-5">
                {profile ? (
                    <div className="space-y-6 text-white">
                        <h1 className="text-2xl font-semibold">User Profile</h1>
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                            <Image
                                src={profile.image || '/default-profile.png'}
                                alt="Profile"
                                width={96}
                                height={96}
                                className="w-24 h-24 rounded-full"
                            />
                            <div className="text-center md:text-left">
                                <div className="flex gap-2 items-center justify-center md:justify-start">
                                    <p className="font-bold">@{session?.user?.name}</p>
                                    {/* Verified Badge */}
                                    <div className="relative group">
                                        <RiVerifiedBadgeFill className="text-blue-500 text-2xl" />
                                        {/* Verified Tooltip (Right Side) */}
                                        <div className="absolute top-1/2 left-full transform -translate-y-1/2 ml-2 bg-black text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                            Verified
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-300">{session?.user?.email}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold">Intro</h2>
                            <p className="text-gray-300">{profile.intro}</p>
                        </div>
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold">Bio</h2>
                            <p className="text-gray-300">{profile.bio}</p>
                        </div>
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold">About</h2>
                            <p className="text-gray-300">{profile.description}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-white">No Profile Available</div>
                )}
            </div>
            <div className="text-center mt-8">
                <Link href="/profileupdate" className="bg-purple-600 p-3 rounded-md text-white hover:bg-purple-700 transition-colors duration-300">
                    Update Profile
                </Link>
            </div>
            </div>
            
        </div>
    );
};

export default ProfileInfo;