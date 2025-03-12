'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const AdminVerificationPanel = () => {
    const { data: session } = useSession();
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const fetchPendingVerifications = async () => {
            try {
                const response = await fetch('/api/admin/verify');
                const data = await response.json();
                console.log('API Response:', data); // Debug API response
                if (data.profiles) {
                    setProfiles(data.profiles);
                } else {
                    toast.error('No pending verifications found');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Something went wrong');
            }
        };

        if (session?.user?.role === 'admin') {
            fetchPendingVerifications();
        }
    }, [session]);

    const handleVerification = async (id, status) => {
        try {
            const response = await fetch('/api/admin/verify', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, status }),
            });

            const data = await response.json();
            console.log('Verification Response:', data);
            if (data.profile) {
                setProfiles(profiles.filter(profile => profile._id !== id));
                toast.success(`Verification ${status === 'accepted' ? 'Approved' : 'Rejected'}`);
            } else {
                toast.error('Something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch('/api/admin/verify', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (data.message) {
                setProfiles(profiles.filter(profile => profile._id !== id));
                toast.success('User profile deleted successfully');
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong');
        }
    };

    if (session?.user?.role !== 'admin') {
        return <div>Unauthorized</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen py-10">
            <div className="bg-gray-800 max-w-5xl mx-auto rounded-md py-10 px-5">
                <h1 className="text-2xl font-semibold text-white">Admin Verification Panel</h1>
                <div className="space-y-4 mt-4">
                    {profiles.map(profile => (
                        <div key={profile._id} className="bg-gray-700 p-4 rounded-md flex justify-between items-center">
                            <div>
                                <p className="text-white font-semibold">{profile.userId.name}</p>
                                <p className="text-gray-300">{profile.userId.email}</p>
                                <img src={profile.verificationImage} alt="Verification" className="w-24 h-24 mt-2 rounded-md" />
                                <p className={`mt-2 font-semibold ${profile.verification === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {profile.verification.toUpperCase()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleVerification(profile._id, 'accepted')}
                                    className="bg-green-600 p-2 rounded-md text-white hover:bg-green-700 transition-colors duration-300"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleVerification(profile._id, 'rejected')}
                                    className="bg-red-600 p-2 rounded-md text-white hover:bg-red-700 transition-colors duration-300"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(profile._id)}
                                    className="bg-gray-600 p-2 rounded-md text-white hover:bg-gray-700 transition-colors duration-300"
                                >
                                    Delete User
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminVerificationPanel;
