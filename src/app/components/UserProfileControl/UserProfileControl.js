'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';
import Image from 'next/image';

const AdminVerificationPanel = () => {
    const { data: session } = useSession();
    const [profiles, setProfiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchPendingVerifications = async () => {
            try {
                const response = await fetch('/api/admin/verify');
                const data = await response.json();
                if (data.profiles?.length > 0) {
                    setProfiles(data.profiles);
                } else {
                    setProfiles([]);
                }
            } catch (error) {
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });

            const data = await response.json();
            if (data.profile) {
                setProfiles(profiles.filter(profile => profile._id !== id));
                toast.success(`Verification ${status === 'accepted' ? 'Approved' : 'Rejected'}`);
            } else {
                toast.error('Something went wrong');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch('/api/admin/verify', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
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
            toast.error('Something went wrong');
        }
    };

    if (session?.user?.role !== 'admin') {
        return <div className="text-center text-white py-10">Unauthorized</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen py-10 text-white px-5">
            <div className="max-w-7xl mx-auto bg-gray-800 rounded-md py-10 px-5">
                <h1 className="text-2xl font-semibold mb-5">User Verification Panel</h1>
                {/* <p className="text-gray-300">Logged in as: {session?.user?.name} ({session?.user?.email})</p> */}
                <p className="text-red-500 font-semibold bg-red-100 p-2 rounded mt-2 text-center animate-pulse">
    ⚠️ Carefully check all user data before verification. Approved users will get full access. Double-check emails and documents.
</p>


                {profiles.length === 0 ? (
                    <p className="text-center text-gray-400 mt-5">Verification data not available</p>
                ) : (
                    <div className="overflow-x-auto mt-5">
                        <table className="w-full border border-gray-700">
                            <thead>
                                <tr className="bg-gray-700 text-white">
                                    <th className="py-3 px-4 border-b border-gray-600">User Name</th>
                                    <th className="py-3 px-4 border-b border-gray-600">Email</th>
                                    <th className="py-3 px-4 border-b border-gray-600">Verification</th>
                                    <th className="py-3 px-4 border-b border-gray-600">Image</th>
                                    <th className="py-3 px-4 border-b border-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.map(profile => (
                                    <tr key={profile._id} className="text-center border-b border-gray-700">
                                        <td className="py-3 px-4">{profile.userId.username}</td>
                                        
                                        <td className="py-3 px-4">{profile.userId.email}</td>
                                        <td className={`py-3 px-4 font-semibold ${profile.verification === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>{profile.verification.toUpperCase()}</td>
                                        <td className="py-3 px-4">
                                            <button onClick={() => setSelectedImage(profile.verificationImage)} className="bg-blue-600 p-2 rounded-md text-white hover:bg-blue-700 transition-colors duration-300">
                                                <FaEye />
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 flex gap-2 justify-center">
                                            <button onClick={() => handleVerification(profile._id, 'accepted')} className="bg-green-600 p-2 rounded-md text-white hover:bg-green-700 transition-colors duration-300">Accept</button>
                                            <button onClick={() => handleVerification(profile._id, 'rejected')} className="bg-red-600 p-2 rounded-md text-white hover:bg-red-700 transition-colors duration-300">Reject</button>
                                            <button onClick={() => handleDeleteUser(profile._id)} className="bg-gray-600 p-2 rounded-md text-white hover:bg-gray-700 transition-colors duration-300">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="relative bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg">
                        <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 text-black font-bold text-xl">&times;</button>
                        <Image
                            src={selectedImage}
                            alt="Verification"
                            width={1500}
                            height={1200}
                            className="w-full rounded-md" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVerificationPanel;
