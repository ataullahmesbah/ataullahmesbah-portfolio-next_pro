"use client";

import React, { useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const NewsletterStatisticsPage = () => {
    const [stats, setStats] = useState({
        totalNewsletters: 0,
        totalViews: 0,
        categoryData: { labels: [], counts: [] },
        viewsOverTime: { labels: [], views: [] },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsletters = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/newsletter/letter');
                const newsletters = await res.json();

                // Calculate statistics
                const totalNewsletters = newsletters.length;
                const totalViews = newsletters.reduce((sum, newsletter) => sum + (newsletter.views || 0), 0);

                // Category-wise newsletter count
                const categoryMap = {};
                newsletters.forEach((newsletter) => {
                    const category = newsletter.category || 'Uncategorized';
                    categoryMap[category] = (categoryMap[category] || 0) + 1;
                });
                const categoryData = {
                    labels: Object.keys(categoryMap),
                    counts: Object.values(categoryMap),
                };

                // Views over time (group by publish date)
                const viewsByDate = {};
                newsletters.forEach((newsletter) => {
                    const date = new Date(newsletter.publishDate).toLocaleDateString();
                    viewsByDate[date] = (viewsByDate[date] || 0) + (newsletter.views || 0);
                });
                const viewsOverTime = {
                    labels: Object.keys(viewsByDate).sort((a, b) => new Date(a) - new Date(b)),
                    views: Object.values(viewsByDate),
                };

                setStats({ totalNewsletters, totalViews, categoryData, viewsOverTime });
            } catch (error) {
                console.error('Error fetching newsletter stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewsletters();
    }, []);

    // Bar Chart Data (Category-wise newsletter count)
    const barChartData = {
        labels: stats.categoryData.labels,
        datasets: [
            {
                label: 'Newsletters per Category',
                data: stats.categoryData.counts,
                backgroundColor: 'rgba(34, 197, 94, 0.6)', // Green shade
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1,
                borderRadius: 5,
            },
        ],
    };

    // Line Chart Data (Views over time)
    const lineChartData = {
        labels: stats.viewsOverTime.labels,
        datasets: [
            {
                label: 'Views Over Time',
                data: stats.viewsOverTime.views,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Shaded area below the line
                borderColor: 'rgba(255, 99, 132, 1)', // Red to pink gradient
                tension: 0.3,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    };

    // Doughnut Chart Data (Total Newsletters vs Total Views)
    const doughnutChartData = {
        labels: ['Total Newsletters', 'Total Views'],
        datasets: [
            {
                data: [stats.totalNewsletters, stats.totalViews],
                backgroundColor: ['rgba(59, 130, 246, 0.6)', 'rgba(234, 179, 8, 0.6)'], // Blue and Yellow
                borderColor: ['rgba(59, 130, 246, 1)', 'rgba(234, 179, 8, 1)'],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#e5e7eb', // Light gray for legend text
                    font: {
                        size: 14,
                    },
                },
                position: 'top',
            },
            title: {
                display: true,
                color: '#e5e7eb',
                font: {
                    size: 18,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#e5e7eb',
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
            y: {
                ticks: {
                    color: '#e5e7eb',
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
        },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-2xl text-white p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-shadow-md mb-8 text-center">
                Newsletter Statistics
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Summary Cards with Purple Shades */}
                <div className="p-4 bg-purple-500/10  border-purple-600/20 backdrop-blur-md rounded-xl shadow-lg border  hover:shadow-xl transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-2 text-gray-200">Total Newsletters</h2>
                    <p className="text-2xl font-bold text-purple-400">{stats.totalNewsletters}</p>
                </div>
                <div className="p-4 bg-blue-500/10 border-blue-600/20 backdrop-blur-md rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-2 text-gray-200">Total Views</h2>
                    <p className="text-2xl font-bold text-purple-300">{stats.totalViews}</p>
                </div>
                <div className="p-4 bg-green-700/10 border-green-600/20 backdrop-blur-md rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-2 text-gray-200">Average Views per Newsletter</h2>
                    <p className="text-2xl font-bold text-purple-200">
                        {stats.totalNewsletters > 0 ? Math.round(stats.totalViews / stats.totalNewsletters) : 0}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart: Category-wise Newsletter Count */}
                <div className="p-4 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-3 text-gray-200">Newsletters by Category</h2>
                    <div className="h-64">
                        <Bar
                            data={barChartData}
                            options={{
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    title: {
                                        display: true,
                                        text: 'Newsletters by Category',
                                        color: '#e5e7eb',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Line Chart: Views Over Time */}
                <div className="p-4 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-3 text-gray-200">Views Over Time</h2>
                    <div className="h-64">
                        <Line
                            data={lineChartData}
                            options={{
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    title: {
                                        display: true,
                                        text: 'Views Over Time',
                                        color: '#e5e7eb',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => `Views: ${context.raw}`,
                                            title: (tooltipItems) => `Date: ${tooltipItems[0].label}`,
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Doughnut Chart: Total Newsletters vs Total Views */}
                <div className="p-4 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-all duration-300 flex justify-center lg:col-span-2 ">
                    <div className="w-full max-w-sm h-72 py-8">
                        <h2 className="text-lg font-semibold mb-3 text-gray-200 text-center">Total Newsletters vs Views</h2>
                        <Doughnut
                            data={doughnutChartData}
                            options={{
                                ...chartOptions,
                                plugins: {
                                    ...chartOptions.plugins,
                                    title: {
                                        display: true,
                                        text: 'Total Newsletters vs Views',
                                        color: '#e5e7eb',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsletterStatisticsPage;