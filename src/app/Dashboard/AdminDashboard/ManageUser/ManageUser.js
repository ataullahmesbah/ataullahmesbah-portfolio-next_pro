// app/admin/users/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaSync, FaSearch, FaKey, FaSignOutAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminUsersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const usersPerPage = 10;

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users', {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            if (!res.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
                setFilteredUsers(data);
                toast.success('Users refreshed successfully!');
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error('Fetch users error:', error);
            toast.error('Failed to fetch users');
            setUsers([]);
            setFilteredUsers([]);
        }
    };

    // Filter users based on search term
    useEffect(() => {
        const filtered = users.filter(
            (user) =>
                (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.username || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [searchTerm, users]);

    // Update user role
    const updateUserRole = async (userId, role) => {
        const confirmChange = window.confirm(`Are you sure you want to change this user's role to ${role}?`);
        if (!confirmChange) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role }),
            });

            if (res.ok) {
                await fetchUsers();
                toast.success(`Role changed to ${role} successfully!`);
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to update role');
            }
        } catch (error) {
            console.error('Update role error:', error);
            toast.error('Network error occurred');
        }
    };

    // Delete a user
    const deleteUser = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            if (res.ok) {
                await fetchUsers();
                toast.success('User deleted successfully!');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            toast.error('Network error occurred');
        }
    };

    // Toggle user status
    const toggleUserStatus = async (userId, status) => {
        const confirmStatus = window.confirm(
            `Are you sure you want to set this user's status to ${status}?`
        );
        if (!confirmStatus) return;

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, status }),
            });

            if (res.ok) {
                await fetchUsers();
                toast.success(`User status updated to ${status} successfully!`);
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to update user status');
            }
        } catch (error) {
            console.error('Toggle status error:', error);
            toast.error('Network error occurred');
        }
    };

    // Reset user password
    const resetUserPassword = async (user) => {
        setSelectedUser(user);
        setShowResetModal(true);
    };

    const confirmPasswordReset = async () => {
        if (!newPassword.trim()) {
            toast.error('Please enter a new password');
            return;
        }

        try {
            const res = await fetch('/api/admin/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUser._id,
                    newPassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Password reset successfully!');
                setShowResetModal(false);
                setNewPassword('');
                setSelectedUser(null);
                await fetchUsers();
            } else {
                toast.error(data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error('Network error occurred');
        }
    };

    // Force logout user
    const forceLogoutUser = async (userId) => {
        const confirmLogout = window.confirm('Are you sure you want to force logout this user?');
        if (!confirmLogout) return;

        try {
            const res = await fetch('/api/admin/users/force-logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('User will be logged out on next request!');
                await fetchUsers();
            } else {
                toast.error(data.message || 'Failed to force logout');
            }
        } catch (error) {
            console.error('Force logout error:', error);
            toast.error('Network error occurred');
        }
    };

    // Format date for display
    const formatDate = (date) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleString();
    };

    // Format IP address
    const formatIP = (ip) => {
        if (!ip) return 'N/A';
        return ip;
    };

    // Redirect if user is not an admin
    useEffect(() => {
        if (status === 'unauthenticated' || (session && session.user?.role !== 'admin')) {
            router.push('/');
        }
    }, [status, session, router]);

    // Fetch users on page load
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role === 'admin') {
            fetchUsers();
        }
    }, [status, session]);

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="dark" />

            {/* Password Reset Modal */}
            {showResetModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-xl w-96">
                        <h3 className="text-lg font-bold text-white mb-4">
                            Reset Password for {selectedUser?.username}
                        </h3>
                        <div className="relative mb-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2 text-gray-400 hover:text-white"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowResetModal(false);
                                    setNewPassword('');
                                    setSelectedUser(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPasswordReset}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 bg-gray-800 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col gap-4 mb-6">
                        <h1 className="text-2xl font-bold text-white">User Management</h1>
                        <div className="bg-red-600 text-white p-4 rounded-lg flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm">
                                Warning: This is a sensitive page. Actions like changing roles, statuses, or deleting users are permanent and can affect system access.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto md:ml-auto">
                            <div className="relative flex-grow md:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by email or username..."
                                    className="pl-10 pr-4 py-2 w-full border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={fetchUsers}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                            >
                                <FaSync className="text-sm" /> Refresh
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Username
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Last Login
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Login IP
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-900 divide-y divide-gray-700">
                                    {currentUsers.length > 0 ? (
                                        currentUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-800">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                    {user.username || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {user.email || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {formatDate(user.lastLogin)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {formatIP(user.lastLoginIP)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    <select
                                                        value={user.role || 'user'}
                                                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                                                        className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white text-sm"
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="moderator">Moderator</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    <select
                                                        value={user.status || 'active'}
                                                        onChange={(e) => toggleUserStatus(user._id, e.target.value)}
                                                        className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white text-sm"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    <div className="flex flex-col gap-2">
                                                        <button
                                                            onClick={() => resetUserPassword(user)}
                                                            className="px-3 py-1.5 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center gap-1 transition-colors text-sm w-full justify-center"
                                                        >
                                                            <FaKey className="text-xs" /> Reset PW
                                                        </button>
                                                        <button
                                                            onClick={() => forceLogoutUser(user._id)}
                                                            className="px-3 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center gap-1 transition-colors text-sm w-full justify-center"
                                                        >
                                                            <FaSignOutAlt className="text-xs" /> Force Logout
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(user._id)}
                                                            className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1 transition-colors text-sm w-full justify-center"
                                                        >
                                                            <FaTrash className="text-xs" /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-400">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredUsers.length > usersPerPage && (
                            <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex items-center justify-between">
                                <div className="text-sm text-gray-300">
                                    Showing <span className="font-medium">{indexOfFirstUser + 1}</span>{' '}
                                    to <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span>{' '}
                                    of <span className="font-medium">{filteredUsers.length}</span> users
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}