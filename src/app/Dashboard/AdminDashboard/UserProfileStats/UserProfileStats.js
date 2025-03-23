'use client';


import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VerificationLineChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/profile/statistics');
                const { stats } = await response.json();

                // ডেটা প্রস্তুত করুন
                const chartData = [
                    { name: 'Verified', value: stats.accepted }, // Verified মানে Accepted
                    { name: 'Pending', value: stats.pending },
                    { name: 'Rejected', value: stats.rejected },
                    { name: 'Not Applied', value: stats.not_applied },
                ];

                setData(chartData);
            } catch (error) {
                console.error("Error fetching user profile statistics:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" /> {/* গ্রিড কালার */}
                    <XAxis 
                        dataKey="name" 
                        stroke="#CBD5E0" 
                        tick={{ fill: '#CBD5E0' }} // X-অক্ষের টেক্সট কালার
                    /> 
                    <YAxis stroke="#CBD5E0" tick={{ fill: '#CBD5E0' }} /> {/* Y-অক্ষের টেক্সট কালার */}
                    <Tooltip
                        contentStyle={{ backgroundColor: '#2D3748', border: 'none', borderRadius: '8px' }} // টুলটিপ স্টাইল
                    />
                    <Legend wrapperStyle={{ color: '#CBD5E0' }} /> {/* লেজেন্ড কালার */}
                    {/* Verified লাইন */}
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#82ca9d" // সবুজ
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                    />
                    {/* Pending লাইন */}
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#ffc658" // হলুদ
                        strokeWidth={2}
                    />
                    {/* Rejected লাইন */}
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#ff4d4f" // লাল
                        strokeWidth={2}
                    />
                    {/* Not Applied লাইন */}
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8" // বেগুনি
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default VerificationLineChart;