'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminUsersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState([]);

    // Fetch all users
    const fetchUsers = async () => {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data);
    };

    // Update user role
    const updateUserRole = async (userId, role) => {
        const confirmChange = window.confirm(
            `Are you sure you want to change this user's role to ${role}?`
        );
        if (!confirmChange) return;

        const res = await fetch('/api/admin/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, role }),
        });

        if (res.ok) {
            fetchUsers(); // Refresh the user list
            toast.success(`Role changed to ${role} successfully!`);
        } else {
            const data = await res.json();
            toast.error(data.message || 'Failed to update role.');
        }
    };

    // Delete a user
    const deleteUser = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        const res = await fetch('/api/admin/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        if (res.ok) {
            fetchUsers(); // Refresh the user list
            toast.success('User deleted successfully!');
        } else {
            const data = await res.json();
            toast.error(data.message || 'Failed to delete user.');
        }
    };

    // Toggle user status (enable/disable)
    const toggleUserStatus = async (userId, status) => {
        const newStatus = status === 'active' ? 'inactive' : 'active';
        const confirmStatus = window.confirm(
            `Are you sure you want to ${newStatus === 'active' ? 'enable' : 'disable'} this user?`
        );
        if (!confirmStatus) return;

        const res = await fetch('/api/admin/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, status: newStatus }),
        });

        if (res.ok) {
            fetchUsers(); // Refresh the user list
            toast.success(`User ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully!`);
        } else {
            const data = await res.json();
            toast.error(data.message || 'Failed to update user status.');
        }
    };

    // Redirect if user is not an admin
    useEffect(() => {
        if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router]);

    // Fetch users on page load
    useEffect(() => {
        fetchUsers();
    }, []);

    if (status === 'loading') {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Username
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.username}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <select
                                        value={user.role}
                                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="user">User</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <button
                                        onClick={() => toggleUserStatus(user._id, user.status)}
                                        className={`px-4 py-2 rounded-md text-sm font-medium ${user.status === 'active'
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                    >
                                        {user.status === 'active' ? 'Disable' : 'Enable'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}