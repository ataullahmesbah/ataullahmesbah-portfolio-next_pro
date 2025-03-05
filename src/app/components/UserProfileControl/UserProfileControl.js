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
            console.log('Verification Response:', data); // Debug verification response
            if (data.profile) {
                setProfiles(profiles.filter(profile => profile._id !== id));
                toast.success(`Verification ${status}`);
            } else {
                toast.error('Something went wrong');
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
            <div className="bg-gray-800 max-w-5xl mx-auto rounded-md py-10">
                <div className="max-w-4xl mx-auto p-5">
                    <h1 className="text-2xl font-semibold text-white">Admin Verification Panel</h1>
                    <div className="space-y-4 mt-4">
                        {profiles.map(profile => (
                            <div key={profile._id} className="bg-gray-700 p-4 rounded-md">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-white">{profile.userId.name}</p>
                                        <p className="text-gray-300">{profile.userId.email}</p>
                                        <p className="text-gray-300">{profile.userId.name}</p>
                                        <p>{session?.user?.name}</p>
                                       
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleVerification(profile._id, 'accepted')}
                                            className="bg-green-600 p-2 rounded-md text-white hover:bg-green-700 transition-colors duration-300"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleVerification(profile._id, 'rejected')}
                                            className="bg-red-600 p-2 rounded-md text-white hover:bg-red-700 transition-colors duration-300 ml-2"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <img src={profile.verificationImage} alt="Verification" className="w-24 h-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminVerificationPanel;