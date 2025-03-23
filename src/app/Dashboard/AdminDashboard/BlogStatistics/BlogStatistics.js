'use client';

import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const BlogStatisticsDashboard = () => {
  const [statistics, setStatistics] = useState({
    totalBlogs: 0,
    blogsByCategory: [],
    popularBlogs: [],
    latestBlogs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/blog/statistics');
        if (!response.ok) throw new Error('Failed to fetch statistics');
        const data = await response.json();
        console.log('Fetched Data:', data);

        setStatistics({
          totalBlogs: data.totalBlogs || 0,
          blogsByCategory: Array.isArray(data.blogsByCategory) ? data.blogsByCategory : [],
          popularBlogs: Array.isArray(data.popularBlogs) ? data.popularBlogs : [],
          latestBlogs: Array.isArray(data.latestBlogs) ? data.latestBlogs : [],
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-900 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  // Blog Categories Chart Data
  const categoryChartData = {
    labels: statistics.blogsByCategory.length > 0
      ? statistics.blogsByCategory.map(cat => cat._id || 'Uncategorized')
      : ['No Data'],
    datasets: [
      {
        label: 'Number of Blogs',
        data: statistics.blogsByCategory.length > 0
          ? statistics.blogsByCategory.map(cat => Number(cat.count || 0))
          : [0],
        backgroundColor: 'rgba(34, 197, 94, 0.6)', // Green
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };
  console.log('Category Chart Data:', categoryChartData);

  // Popular Blogs (Views) Chart Data
  const popularBlogsChartData = {
    labels: statistics.popularBlogs.length > 0
      ? statistics.popularBlogs.map(blog => blog.title ? blog.title.substring(0, 15) + (blog.title.length > 15 ? '...' : '') : 'Unknown')
      : ['No Data'],
    datasets: [
      {
        label: 'Views',
        data: statistics.popularBlogs.length > 0
          ? statistics.popularBlogs.map(blog => Number(blog.views || 0))
          : [0],
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };
  console.log('Popular Blogs Chart Data:', popularBlogsChartData);

  // Recent Blogs (by Date) Chart Data
  const latestBlogsChartData = {
    labels: statistics.latestBlogs.length > 0
      ? statistics.latestBlogs.map(blog => blog.publishDate || 'N/A')
      : ['No Data'],
    datasets: [
      {
        label: 'Views',
        data: statistics.latestBlogs.length > 0
          ? statistics.latestBlogs.map(blog => Number(blog.views || 0))
          : [0],
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.2)', // Purple fill
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        tension: 0.3, // Smooth line
      },
    ],
  };
  console.log('Latest Blogs Chart Data:', latestBlogsChartData);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9CA3AF' },
      },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' },
      },
      y: {
        ticks: { color: '#9CA3AF' },
        grid: { color: '#374151' },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-800">
      <h1 className="text-2xl font-semibold text-white mb-6">Blog Statistics Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Blog Categories */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white">Blog Categories</h2>
            <span className="text-sm text-gray-400">Total: {statistics.totalBlogs.toLocaleString()}</span>
          </div>
          <div className="h-[300px]">
            <Bar data={categoryChartData} options={{
              ...chartOptions,
              indexAxis: 'y', // Horizontal bar chart
              scales: {
                ...chartOptions.scales,
                x: { ...chartOptions.scales.x, title: { display: true, text: 'Number of Blogs', color: '#fff' } },
                y: { ...chartOptions.scales.y, title: { display: true, text: 'Category', color: '#fff' } },
              },
            }} />
          </div>
        </div>

        {/* Most Popular Blogs (Views) */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-white mb-4">Most Popular Blogs</h2>
          <div className="h-[300px]">
            <Bar data={popularBlogsChartData} options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                x: { ...chartOptions.scales.x, title: { display: true, text: 'Blog Titles', color: '#fff' }, ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } },
                y: { ...chartOptions.scales.y, title: { display: true, text: 'Views', color: '#fff' } },
              },
            }} />
          </div>
        </div>

        {/* Recent Blog Activity (by Date) */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-white mb-4">Recent Blog Activity</h2>
          <div className="h-[300px]">
            <Line data={latestBlogsChartData} options={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                x: { ...chartOptions.scales.x, title: { display: true, text: 'Publish Date', color: '#fff' }, ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } },
                y: { ...chartOptions.scales.y, title: { display: true, text: 'Views', color: '#fff' } },
              },
            }} />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Blogs', value: statistics.totalBlogs, color: 'bg-blue-500/10 border-blue-500/20' },
          {
            label: 'Avg. Views (Popular)',
            value: Math.round(statistics.popularBlogs.reduce((sum, b) => sum + Number(b.views || 0), 0) / (statistics.popularBlogs.length || 1)),
            color: 'bg-green-500/10 border-green-500/20',
          },
          { label: 'Categories', value: statistics.blogsByCategory.length, color: 'bg-purple-500/10 border-purple-500/20' },
        ].map((stat, idx) => (
          <div key={idx} className={`p-4 rounded-lg border ${stat.color}`}>
            <h3 className="text-sm font-medium text-gray-300">{stat.label}</h3>
            <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogStatisticsDashboard;