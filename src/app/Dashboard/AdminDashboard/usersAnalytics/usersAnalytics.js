"use client";
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RiVerifiedBadgeFill } from 'react-icons/ri';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch users data
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/admin/users');
                const data = await response.json();
                setUsers(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Calculate total users, active users, inactive users, admins, moderators, and normal users
    const totalUsers = users.length;
    const activeUsers = users.filter((user) => user.status === 'active').length;
    const inactiveUsers = users.filter((user) => user.status === 'inactive').length;
    const admins = users.filter((user) => user.role === 'admin').length;
    const moderators = users.filter((user) => user.role === 'moderator').length;
    const normalUsers = users.filter((user) => user.role === 'user').length;

    // Data for the pie chart
    const pieChartData = [
        { name: 'Active Users', value: activeUsers },
        { name: 'Inactive Users', value: inactiveUsers },
        { name: 'Admins', value: admins },
        { name: 'Moderators', value: moderators },
        { name: 'Normal Users', value: normalUsers },
    ];

    // Colors for the pie chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 bg-gray-900 text-white min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            {/* User Summary Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {/* Total Users Box */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <p className="text-3xl font-bold">{totalUsers}</p>
                    <p className="text-gray-400">Total Users</p>
                </div>

                {/* Active Users Box */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <p className="text-3xl font-bold">{activeUsers}</p>
                    <p className="text-gray-400">Active Users</p>
                </div>

                {/* Inactive Users Box */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <p className="text-3xl font-bold">{inactiveUsers}</p>
                    <p className="text-gray-400">Inactive Users</p>
                </div>

                {/* Admins Box */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <p className="text-3xl font-bold">{admins}</p>
                    <p className="text-gray-400">Admins</p>
                </div>

                {/* Moderators Box */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <p className="text-3xl font-bold">{moderators}</p>
                    <p className="text-gray-400">Moderators</p>
                </div>

                {/* Normal Users Box */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <p className="text-3xl font-bold">{normalUsers}</p>
                    <p className="text-gray-400">Normal Users</p>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">User Breakdown</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Verified Badges */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Verified Users</h2>
                <div className="flex space-x-4">
                    {users
                        .filter((user) => user.status === 'active')
                        .map((user) => (
                            <div key={user._id} className="relative group">
                                {user.role === 'admin' && (
                                    <p className="text-orange-500 flex items-center justify-center">
                                        <RiVerifiedBadgeFill className="text-orange-500" size={20} />
                                    </p>
                                )}
                                {user.role === 'moderator' && (
                                    <p className="text-blue-500 flex items-center justify-center">
                                        <RiVerifiedBadgeFill className="text-blue-500" size={20} />
                                    </p>
                                )}
                                {user.role === 'user' && (
                                    <p className="text-gray-500 flex items-center justify-center">
                                        <RiVerifiedBadgeFill className="text-gray-500" size={20} />
                                    </p>
                                )}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
                                    Verified
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}