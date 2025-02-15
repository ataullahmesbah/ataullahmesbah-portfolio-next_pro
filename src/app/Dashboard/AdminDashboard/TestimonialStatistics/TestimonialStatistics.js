'use client';

import React, { useEffect, useState } from 'react';
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Scatter,
    ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

const TestimonialStatistics = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/testimonials'); // Adjust endpoint as needed
                const formattedData = response.data.map(item => ({
                    name: item.user_name,
                    rating: item.rating,
                    category: item.categories,
                    
                    position: item.user_position,
                }));
                setData(formattedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" scale="band" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="rating" fill="#8884d8" stroke="#8884d8" />
                <Bar dataKey="category" barSize={20} fill="#413ea0" />
                <Line type="monotone" dataKey="position" stroke="#ff7300" />
                
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default TestimonialStatistics;


