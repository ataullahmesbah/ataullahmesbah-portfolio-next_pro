// src/app/admin/projects/statistics/page.js
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, Title, CategoryScale, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, Title, CategoryScale, BarElement);

const ProjectStatisticsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/project-stats');
                if (!response.ok) throw new Error('Failed to fetch statistics');
                const data = await response.json();
                setStats(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg text-center max-w-md mx-auto mt-10">
                Error: {error}
            </div>
        );
    }

    // Prepare data for charts with updated colors
    const categoryChartData = {
        labels: stats.projectsByCategory.map(item => item._id),
        datasets: [
            {
                data: stats.projectsByCategory.map(item => item.count),
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#6B7280'], // Blue, Green, Yellow, Purple, Red, Gray
            },
        ],
    };

    const projectsOverTimeData = {
        labels: stats.projectsOverTime.map(item => item._id),
        datasets: [
            {
                label: 'Projects',
                data: stats.projectsOverTime.map(item => item.count),
                fill: false,
                borderColor: '#3B82F6', // Blue
                backgroundColor: '#3B82F6',
                tension: 0.1,
            },
        ],
    };

    const topViewedProjectsData = {
        labels: stats.topViewedProjects.map(project => project.title),
        datasets: [
            {
                label: 'Views',
                data: stats.topViewedProjects.map(project => project.views),
                backgroundColor: '#10B981', // Green
            },
        ],
    };

    return (
        <div className="bg-gray-900 rounded-lg  px-4 sm:px-6 lg:px-8 py-8">
            <h1 className=" text-white mb-8 text-center tracking-tight">
                Project Stats
            </h1>

            <div className="max-w-7xl mx-auto">
                {/* Overview Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-gray-300 mb-1">Projects</h3>
                        <p className="text-xl font-bold text-white">{stats.totalProjects}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-gray-300 mb-1">Views</h3>
                        <p className="text-xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg text-center">
                        <h3 className="text-sm font-medium text-gray-300 mb-1">Avg. Views</h3>
                        <p className="text-xl font-bold text-white">{Math.round(stats.avgViews)}</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Projects by Category */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <h3 className="text-sm font-semibold text-white mb-2">By Category</h3>
                        <div className="h-64">
                            <Pie data={categoryChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Projects Created Over Time */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <h3 className="text-sm font-semibold text-white mb-2">Created Over Time</h3>
                        <div className="h-64">
                            <Line data={projectsOverTimeData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Top Viewed Projects */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <h3 className="text-sm font-semibold text-white mb-2">Top 5 Viewed</h3>
                        <div className="h-64">
                            <Bar data={topViewedProjectsData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Content Depth Analysis */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <h3 className="text-sm font-semibold text-white mb-2">Content Depth</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-center">
                                <p className="text-xs text-gray-300">Key Points</p>
                                <p className="text-sm font-bold text-white">{stats.keyPointsPercentage.toFixed(1)}%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-300">Avg. Key Points</p>
                                <p className="text-sm font-bold text-white">{stats.avgKeyPoints.toFixed(1)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-300">Website Features</p>
                                <p className="text-sm font-bold text-white">{stats.websiteFeaturesPercentage.toFixed(1)}%</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-300">Avg. Features</p>
                                <p className="text-sm font-bold text-white">{stats.avgWebsiteFeatures.toFixed(1)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-xs font-medium text-gray-300 mb-1">With Gallery</h3>
                        <p className="text-sm font-bold text-white">{stats.galleryPercentage.toFixed(1)}%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-xs font-medium text-gray-300 mb-1">Avg. Gallery</h3>
                        <p className="text-sm font-bold text-white">{stats.avgGalleryImages.toFixed(1)}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-xs font-medium text-gray-300 mb-1">With Support</h3>
                        <p className="text-sm font-bold text-white">{stats.supportPercentage.toFixed(1)}%</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-xs font-medium text-gray-300 mb-1">Meta Desc Len</h3>
                        <p className="text-sm font-bold text-white">{Math.round(stats.avgMetaDescLength)}</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
                        <h3 className="text-xs font-medium text-gray-300 mb-1">Meta 160</h3>
                        <p className="text-sm font-bold text-white">{stats.metaDescExceeding}</p>
                    </div>
                </div>

              
            </div>
        </div>
    );
};

export default ProjectStatisticsPage;