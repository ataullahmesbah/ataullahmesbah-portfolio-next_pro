'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { FaEye, FaSearch, FaSync, FaExclamationTriangle } from 'react-icons/fa';
import { FaExternalLinkAlt } from 'react-icons/fa'; // New icon for View Profile
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link'; // Added for dynamic link

const AdminVerificationPanel = () => {
    const { data: session, status } = useSession();
    const [pendingProfiles, setPendingProfiles] = useState([]);
    const [verifiedProfiles, setVerifiedProfiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchVerifications = async () => {
        if (status !== 'authenticated' || session?.user?.role !== 'admin') return;

        setLoading(true);
        try {
            const response = await fetch('/api/admin/verify');
            const data = await response.json();
            if (response.ok && data.pending && data.verified) {
                setPendingProfiles(data.pending);
                setVerifiedProfiles(data.verified);
            } else {
                setPendingProfiles([]);
                setVerifiedProfiles([]);
                toast.error(data.message || 'No verification data available');
            }
        } catch (error) {
            console.error('Error fetching verifications:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVerifications();
    }, [session, status]);

    const handleVerification = async (id, status) => {
        try {
            const response = await fetch('/api/admin/verify', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });

            const data = await response.json();
            if (response.ok && data.profile) {
                if (activeTab === 'pending') {
                    setPendingProfiles(pendingProfiles.filter(profile => profile._id !== id));
                    if (status === 'accepted') {
                        setVerifiedProfiles([...verifiedProfiles, { ...data.profile, userId: data.profile.userId }]);
                    }
                } else {
                    if (status === 'rejected') {
                        setVerifiedProfiles(verifiedProfiles.filter(profile => profile._id !== id));
                        setPendingProfiles([...pendingProfiles, { ...data.profile, userId: data.profile.userId }]);
                    }
                }
                toast.success(`Verification ${status === 'accepted' ? 'Approved' : 'Rejected'}`);
            } else {
                toast.error(data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error updating verification:', error);
            toast.error('Something went wrong');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user profile? This action cannot be undone.')) return;

        try {
            const response = await fetch('/api/admin/verify', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (response.ok && data.message) {
                if (activeTab === 'pending') {
                    setPendingProfiles(pendingProfiles.filter(profile => profile._id !== id));
                } else {
                    setVerifiedProfiles(verifiedProfiles.filter(profile => profile._id !== id));
                }
                toast.success('User profile deleted successfully');
            } else {
                toast.error(data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Something went wrong');
        }
    };

    const filteredPendingProfiles = pendingProfiles.filter(profile =>
        profile.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredVerifiedProfiles = verifiedProfiles.filter(profile =>
        profile.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (status === 'loading') {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
    }

    if (!session || session?.user?.role !== 'admin') {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Unauthorized</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-7xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">User Verification Panel</h1>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={fetchVerifications}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSync className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </motion.button>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-red-100 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2"
                >
                    <FaExclamationTriangle className="text-red-600" />
                    <p className="font-semibold">
                        ⚠️ Carefully check all user data before verification. Approved users will get full access. Double-check emails and documents.
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="border-b border-gray-600 mb-6">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'pending' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400 hover:text-white'}`}
                        >
                            Pending Verifications ({filteredPendingProfiles.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('verified')}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'verified' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-400 hover:text-white'}`}
                        >
                            Verified Users ({filteredVerifiedProfiles.length})
                        </button>
                    </nav>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'pending' && (
                        <motion.div
                            key="pending"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-x-auto"
                        >
                            {filteredPendingProfiles.length === 0 ? (
                                <div className="text-center text-gray-400 py-10">
                                    No pending verifications found
                                </div>
                            ) : (
                                <table className="w-full border border-gray-700 rounded-lg">
                                    <thead>
                                        <tr className="bg-gray-700 text-white">
                                            <th className="py-3 px-4 text-left">User Name</th>
                                            <th className="py-3 px-4 text-left">Email</th>
                                            <th className="py-3 px-4 text-left">Status</th>
                                            <th className="py-3 px-4 text-left">Image</th>
                                            <th className="py-3 px-4 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPendingProfiles.map(profile => (
                                            <motion.tr
                                                key={profile._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="border-b border-gray-600 hover:bg-gray-600"
                                            >
                                                <td className="py-3 px-4">{profile.userId?.username || 'N/A'}</td>
                                                <td className="py-3 px-4">{profile.userId?.email || 'N/A'}</td>
                                                <td className="py-3 px-4 font-semibold text-yellow-500">
                                                    {profile.verification.toUpperCase()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setSelectedImage(profile.verificationImage)}
                                                        className="bg-blue-600 p-2 rounded-md text-white hover:bg-blue-700"
                                                    >
                                                        <FaEye />
                                                    </motion.button>
                                                </td>
                                                <td className="py-3 px-4 flex gap-2 flex-wrap">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleVerification(profile._id, 'accepted')}
                                                        className="px-3 py-1 bg-green-600 rounded-md text-white hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleVerification(profile._id, 'rejected')}
                                                        className="px-3 py-1 bg-red-600 rounded-md text-white hover:bg-red-700"
                                                    >
                                                        Reject
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDeleteUser(profile._id)}
                                                        className="px-3 py-1 bg-gray-600 rounded-md text-white hover:bg-gray-700"
                                                    >
                                                        Delete
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'verified' && (
                        <motion.div
                            key="verified"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-x-auto"
                        >
                            {filteredVerifiedProfiles.length === 0 ? (
                                <div className="text-center text-gray-400 py-10">
                                    No verified users found
                                </div>
                            ) : (
                                <table className="w-full border border-gray-700 rounded-lg">
                                    <thead>
                                        <tr className="bg-gray-700 text-white">
                                            <th className="py-3 px-4 text-left">User Name</th>
                                            <th className="py-3 px-4 text-left">Email</th>
                                            <th className="py-3 px-4 text-left">Status</th>
                                            <th className="py-3 px-4 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredVerifiedProfiles.map(profile => (
                                            <motion.tr
                                                key={profile._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="border-b border-gray-600 hover:bg-gray-600"
                                            >
                                                <td className="py-3 px-4">{profile.username || profile.userId?.username || 'N/A'}</td>
                                                <td className="py-3 px-4">{profile.userId?.email || 'N/A'}</td>
                                                <td className="py-3 px-4 font-semibold text-green-500">
                                                    {profile.verification.toUpperCase()}
                                                </td>
                                                <td className="py-3 px-4 flex gap-2 flex-wrap">
                                                    <Link href={`/u/${profile.slug || profile.userId?.username || 'unknown'}`} passHref legacyBehavior>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            className="px-3 py-1 bg-blue-600 rounded-md text-white hover:bg-blue-700 flex items-center gap-2"
                                                        >
                                                            <FaExternalLinkAlt />
                                                            View Profile
                                                        </motion.button>
                                                    </Link>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleVerification(profile._id, 'rejected')}
                                                        className="px-3 py-1 bg-red-600 rounded-md text-white hover:bg-red-700"
                                                    >
                                                        Revoke
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleDeleteUser(profile._id)}
                                                        className="px-3 py-1 bg-gray-600 rounded-md text-white hover:bg-gray-700"
                                                    >
                                                        Delete
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Image Preview Modal */}
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="relative bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300"
                            >
                                ×
                            </button>
                            <Image
                                src={selectedImage}
                                alt="Verification Document"
                                width={800}
                                height={600}
                                className="w-full rounded-md object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AdminVerificationPanel;