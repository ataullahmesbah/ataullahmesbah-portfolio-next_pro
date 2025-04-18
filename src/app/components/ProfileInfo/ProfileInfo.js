'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ProfileInfo = () => {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState(null);
    const [verificationImage, setVerificationImage] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            toast.error('Please log in to access your profile.');
        }
    }, [status, router]);

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

    useEffect(() => {
        fetchProfile();
    }, [status, session]);

    const handleVerificationSubmit = async () => {
        if (!verificationImage) {
            toast.error('Please upload an image');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('image', verificationImage);
        formData.append('userId', session.user.id);

        try {
            const response = await fetch('/api/profile/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setLoading(false);

            if (data.profile) {
                setProfile(data.profile);
                setVerificationImage(null); // Reset the image state
                toast.success('Verification submitted successfully');
                setIsPopupOpen(false);
            } else {
                toast.error('Something went wrong');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            toast.error('Something went wrong');
        }
    };

    if (!profile) return (
        <div className="bg-gray-800 min-h-screen flex justify-center items-center">
            <div className="text-center text-xl text-white">
                <p>No Profile Available</p>
                <p>Update your profile <Link href='/profileupdate' className='text-blue-400'>Get Here</Link></p>
            </div>
        </div>
    );

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
                                    width={64}
                                    height={64}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <div className="text-center md:text-left">
                                    <div className="flex gap-2 items-center justify-center md:justify-start">
                                        <p className="">@{session?.user?.name}</p>

                                        {/* Verification Status */}
                                        {profile.verification === 'not_applied' && (
                                            <button
                                                onClick={() => setIsPopupOpen(true)}
                                                className="text-blue-500 p-3 rounded-md flex items-center gap-2 hover:text-blue-600 transition-colors duration-300">
                                                <RiVerifiedBadgeFill />
                                                <p>Get Verification</p>
                                            </button>
                                        )}

                                        {profile.verification === 'pending' && (
                                            <p className="text-yellow-500">Verification Pending...</p>
                                        )}



                                        {profile.verification === 'accepted' && (
                                            <div className="relative group flex items-center justify-center">
                                                <RiVerifiedBadgeFill
                                                    size={18}

                                                    className={`
                ${session?.user?.role === 'admin' ? 'text-orange-500' :
                                                            session?.user?.role === 'moderator' ? 'text-blue-500' :
                                                                session?.user?.role === 'user' ? 'text-gray-500' : 'text-gray-500'}
                transition duration-300 cursor-pointer
            `}
                                                />
                                                {/* Tooltip on Hover */}
                                                <span className="absolute bottom-full mb-1 hidden group-hover:flex text-xs bg-black text-white px-2 py-1 rounded-md">
                                                    Verified
                                                </span>
                                                                                     </div>
                                        )}



                                        {profile.verification === 'rejected' && (
                                            <p className="text-red-500">Verification Rejected. Please try again.</p>
                                        )}



                                        {/* Verification Status */}
                                        {profile.verification === 'rejected' && (
                                            <button
                                                onClick={() => setIsPopupOpen(true)}
                                                className="text-blue-500 p-3 rounded-md flex items-center gap-2 hover:text-blue-600 transition-colors duration-300">
                                                <RiVerifiedBadgeFill />
                                                <p>Get Verification</p>
                                            </button>
                                        )}

                                    </div>
                                    <p className="text-gray-300">{session?.user?.email}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h2 className="text-xl font-semibold">Intro</h2>
                                <p className="text-gray-300">{profile.intro}</p>
                            </div>
                            <p className="text-gray-300">Role: {session?.user?.role}</p>
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
                        <div className="text-white">
                            No Profile Available...
                        </div>
                    )}
                </div>
                <div className="text-center mt-8">
                    <Link href="/profileupdate" className="bg-purple-600 p-3 rounded-md text-white hover:bg-purple-700 transition-colors duration-300">
                        Update Profile
                    </Link>
                </div>
            </div>

            {/* Popup for Document Upload */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-3">Upload Verification Document</h3>
                        <input type="file" onChange={(e) => setVerificationImage(e.target.files[0])} />
                        <div className="mt-3">
                            <button
                                onClick={handleVerificationSubmit}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                            <button onClick={() => setIsPopupOpen(false)} className="ml-3 text-red-500">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileInfo;