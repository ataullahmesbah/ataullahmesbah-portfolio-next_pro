'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TestimonialChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch('/api/testimonials');
                const data = await response.json();

                // Transform MongoDB data to Recharts-friendly structure
                const formattedData = data.map(item => ({
                    name: item.user_name || 'Unknown',
                    uv: item.positive_reviews || 0,
                    pv: item.negative_reviews || 0
                }));

                console.log('Formatted Chart Data:', formattedData);
                setChartData(formattedData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchTestimonials();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 p-6 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Testimonial Insights</h2>
            <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
                <h3 className="mb-4 text-lg font-semibold">User Feedback Overview</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00c6ff" stopOpacity={0.7} />
                                <stop offset="95%" stopColor="#00c6ff" stopOpacity={0.2} />
                            </linearGradient>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.7} />
                                <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#e2e8f0" />
                        <YAxis stroke="#e2e8f0" />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="uv" stroke="#00c6ff" fill="url(#colorUv)" name="Positive Reviews" />
                        <Area type="monotone" dataKey="pv" stroke="#ff6b6b" fill="url(#colorPv)" name="Negative Reviews" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TestimonialChart;
