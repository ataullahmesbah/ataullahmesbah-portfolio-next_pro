// app/admin/users/page.js
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaSync, FaSearch, FaKey, FaSignOutAlt, FaEye, FaEyeSlash, FaTimes, FaShieldAlt, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import AdminResetPasswordModal from '../AdminResetPasswordModal/AdminResetPasswordModal';


export default function AdminUsersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
                toast.success(`Role changed to ${role} successfully! User will be logged out.`);
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
        const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
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
        const action = status === 'inactive' ? 'deactivate' : 'activate';
        const confirmStatus = window.confirm(
            `Are you sure you want to ${action} this user? ${status === 'inactive' ? 'User will be logged out immediately.' : ''}`
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
                toast.success(`User ${action}d successfully!${status === 'inactive' ? ' User has been logged out.' : ''}`);
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

    // Force logout user
    const forceLogoutUser = async (userId, username) => {
        const confirmLogout = window.confirm(`Are you sure you want to force logout ${username}? This will immediately terminate their session.`);
        if (!confirmLogout) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/users/force-logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('User has been logged out successfully!');
                await fetchUsers();
            } else {
                toast.error(data.message || 'Failed to force logout');
            }
        } catch (error) {
            console.error('Force logout error:', error);
            toast.error('Network error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Format date for display
    const formatDate = (date) => {
        if (!date) return 'Never';
        const now = new Date();
        const loginDate = new Date(date);
        const diffMs = now - loginDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return loginDate.toLocaleDateString() + ' ' + loginDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Format IP address
    const formatIP = (ip) => {
        if (!ip) return 'N/A';
        if (ip === 'unknown' || ip === '::1') return 'Local';
        return ip.length > 15 ? ip.substring(0, 15) + '...' : ip;
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'inactive':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    // Get role badge color
    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'moderator':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'user':
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
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
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading Admin Panel...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="dark" />

            {/* Admin Reset Password Modal */}
            <AdminResetPasswordModal
                isOpen={showResetModal}
                onClose={() => {
                    setShowResetModal(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onSuccess={fetchUsers}
            />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
                {/* Header */}
                <div className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white">User Management</h1>
                                <p className="text-gray-400 text-sm mt-1">Manage user accounts and permissions</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaSearch className="text-gray-400 text-sm" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="pl-10 pr-4 py-2 w-64 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-800 text-white placeholder-gray-400 transition-all duration-200"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={fetchUsers}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <FaSync className={`text-sm ${isLoading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Total Users</p>
                                    <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
                                </div>
                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <FaSync className="text-blue-400 text-lg" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Active Users</p>
                                    <p className="text-2xl font-bold text-white mt-1">
                                        {users.filter(u => u.status === 'active').length}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-500/20 rounded-lg">
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Admins</p>
                                    <p className="text-2xl font-bold text-white mt-1">
                                        {users.filter(u => u.role === 'admin').length}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-500/20 rounded-lg">
                                    <FaShieldAlt className="text-purple-400 text-lg" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Online Now</p>
                                    <p className="text-2xl font-bold text-white mt-1">
                                        {users.filter(u => u.lastLogin && (new Date() - new Date(u.lastLogin)) < 15 * 60 * 1000).length}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-500/20 rounded-lg">
                                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-800/80">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                            Last Activity
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                            Role & Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {currentUsers.length > 0 ? (
                                        currentUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-800/50 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                                            <span className="text-white font-semibold text-sm">
                                                                {(user.username || 'U').charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-white">
                                                                {user.username || 'Unknown'}
                                                            </div>
                                                            <div className="text-sm text-gray-400">
                                                                {user.email || 'No email'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-white">
                                                        {formatDate(user.lastLogin)}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        IP: {formatIP(user.lastLoginIP)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2">
                                                        <select
                                                            value={user.role || 'user'}
                                                            onChange={(e) => updateUserRole(user._id, e.target.value)}
                                                            className="text-xs px-3 py-1 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800 text-white"
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="moderator">Moderator</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                        <select
                                                            value={user.status || 'active'}
                                                            onChange={(e) => toggleUserStatus(user._id, e.target.value)}
                                                            className="text-xs px-3 py-1 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800 text-white"
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => resetUserPassword(user)}
                                                            className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                                                            title="Reset Password"
                                                        >
                                                            <FaKey className="text-xs" />
                                                            Reset PW
                                                        </button>
                                                        <button
                                                            onClick={() => forceLogoutUser(user._id, user.username)}
                                                            disabled={isLoading}
                                                            className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm disabled:opacity-50"
                                                            title="Force Logout"
                                                        >
                                                            <FaSignOutAlt className="text-xs" />
                                                            Logout
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(user._id)}
                                                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                                                            title="Delete User"
                                                        >
                                                            <FaTrash className="text-xs" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center">
                                                <div className="text-gray-400 text-sm">
                                                    <FaSearch className="mx-auto text-2xl mb-2 opacity-50" />
                                                    No users found matching your search
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {filteredUsers.length > usersPerPage && (
                            <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-800 flex items-center justify-between">
                                <div className="text-sm text-gray-400">
                                    Showing <span className="font-medium text-white">{indexOfFirstUser + 1}</span> to{' '}
                                    <span className="font-medium text-white">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                                    <span className="font-medium text-white">{filteredUsers.length}</span> users
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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