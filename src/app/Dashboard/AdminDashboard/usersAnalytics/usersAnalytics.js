'use client';

import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
    const [state, setState] = useState({
        series: [44, 55, 67, 83, 23, 11], // Example data
        options: {
            chart: {
                height: 300, // ⬅️ Made chart smaller
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                        margin: 5,
                        size: '25%', // ⬅️ Reduced size for a compact look
                        background: 'transparent',
                    },
                    dataLabels: {
                        name: {
                            show: true,
                            fontSize: '12px', // ⬅️ Smaller font
                            fontWeight: '500',
                            color: '#ffffff',
                        },
                        value: {
                            show: true,
                            fontSize: '12px', // ⬅️ Smaller font
                            fontWeight: '600',
                            color: '#ffffff',
                        },
                    },
                },
            },
            colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5', '#FF4500', '#32CD32'],
            labels: ['Total Users', 'Admins', 'Moderators', 'Normal Users', 'Active Users', 'Inactive Users'],
            legend: {
                show: true,
                fontSize: '12px', // ⬅️ Smaller font
                fontWeight: '500',
                position: 'bottom',
                horizontalAlign: 'center',
                labels: {
                    colors: '#ffffff',
                },
            },
            tooltip: {
                enabled: true,
                style: {
                    fontSize: '12px', // ⬅️ Smaller font
                    fontWeight: '500',
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            height: 250, // ⬅️ Smaller for mobile
                        },
                        legend: {
                            show: true,
                            position: 'bottom',
                        },
                    },
                },
            ],
        },
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/admin/users');
                const data = await response.json();
                setUsers(data);
                setLoading(false);

                // Calculate user roles and statuses
                const totalUsers = data.length;
                const admins = data.filter((user) => user.role === 'admin').length;
                const moderators = data.filter((user) => user.role === 'moderator').length;
                const normalUsers = data.filter((user) => user.role === 'user').length;
                const activeUsers = data.filter((user) => user.status === 'active').length;
                const inactiveUsers = data.filter((user) => user.status === 'inactive').length;

                // Update Chart Data
                setState((prev) => ({
                    ...prev,
                    series: [totalUsers, admins, moderators, normalUsers, activeUsers, inactiveUsers],
                }));
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div className="text-center text-white">Loading...</div>;
    }

    return (
        <div className="p-4 flex flex-col items-center text-white bg-gray-900 rounded-lg shadow-md w-full ">
            <h3 className="text-lg font-semibold mb-4">User Statistics</h3>

            {/* Radial Bar Chart */}
            <div className="w-full flex justify-center">
                <ReactApexChart options={state.options} series={state.series} type="radialBar" height={300} />
            </div>

            {/* User Summary Boxes */}
            <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                {[
                    { title: 'Total Users', value: users.length },
                    { title: 'Admins', value: users.filter((user) => user.role === 'admin').length },
                    { title: 'Moderators', value: users.filter((user) => user.role === 'moderator').length },
                    { title: 'Normal Users', value: users.filter((user) => user.role === 'user').length },
                    { title: 'Active Users', value: users.filter((user) => user.status === 'active').length },
                    { title: 'Inactive Users', value: users.filter((user) => user.status === 'inactive').length },
                ].map((item, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded-lg shadow-md text-center text-sm">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-2xl font-bold">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApexChart;
