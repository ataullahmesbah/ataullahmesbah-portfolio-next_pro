'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const VerificationLineChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/profile/statistics');
        if (!response.ok) throw new Error('Failed to fetch data');

        const { stats } = await response.json();

        const chartData = [
          { name: 'Verified', value: stats.accepted, fill: '#22c55e' },
          { name: 'Pending', value: stats.pending, fill: '#f59e0b' },
          { name: 'Rejected', value: stats.rejected, fill: '#ef4444' },
          { name: 'Not Applied', value: stats.not_applied, fill: '#8b5cf6' },
        ];

        setData(chartData);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{label}</p>
          <p className="text-sm text-gray-300">
            Count: <span className="font-bold text-white">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-900 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Verification Statistics</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
            opacity={0.3}
          />
          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={false}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: 20,
              color: '#9CA3AF',
              fontSize: 12
            }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Verified"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 5, fill: '#22c55e' }}
            activeDot={{ r: 8, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Pending"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ r: 5, fill: '#f59e0b' }}
            activeDot={{ r: 8, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Rejected"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 5, fill: '#ef4444' }}
            activeDot={{ r: 8, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Not Applied"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ r: 5, fill: '#8b5cf6' }}
            activeDot={{ r: 8, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VerificationLineChart;