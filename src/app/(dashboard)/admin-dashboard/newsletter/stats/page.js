// src/app/admin/newsletter/stats/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation'; // Import annotation plugin
import toast, { Toaster } from 'react-hot-toast';
import { FaUsers, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

// Register Chart.js components and annotation plugin
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin // Register annotation plugin
);

const NewsletterStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch stats
    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/newsletter/stats', {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setStats(data.stats);
            } else {
                toast.error(data.error || 'Failed to fetch stats');
            }
        } catch (error) {
            toast.error('Error fetching stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Prepare data for charts
    const countryChartData = stats?.countryDistribution ? {
        labels: stats.countryDistribution.map(item => item._id || 'Unknown'),
        datasets: [{
            label: 'Subscribers by Country',
            data: stats.countryDistribution.map(item => item.count),
            backgroundColor: [
                'rgba(52, 152, 219, 0.8)',
                'rgba(46, 204, 113, 0.8)',
                'rgba(155, 89, 182, 0.8)',
                'rgba(241, 196, 15, 0.8)',
                'rgba(231, 76, 60, 0.8)',
                'rgba(26, 188, 156, 0.8)',
                'rgba(230, 126, 34, 0.8)',
                'rgba(149, 165, 166, 0.8)',
                'rgba(236, 240, 241, 0.8)',
                'rgba(127, 140, 141, 0.8)'
            ],
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 1,
            borderRadius: 8,
            hoverBackgroundColor: [
                'rgba(52, 152, 219, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(155, 89, 182, 1)',
                'rgba(241, 196, 15, 1)',
                'rgba(231, 76, 60, 1)',
                'rgba(26, 188, 156, 1)',
                'rgba(230, 126, 34, 1)',
                'rgba(149, 165, 166, 1)',
                'rgba(236, 240, 241, 1)',
                'rgba(127, 140, 141, 1)'
            ]
        }]
    } : null;

    // Subscriptions Over Time (Hospital Blood Report Style)
    const subscriptionOverTimeData = stats?.subscriptionOverTime ? {
        labels: stats.subscriptionOverTime.map(item => item._id),
        datasets: [{
            label: 'Subscriptions Over Time',
            data: stats.subscriptionOverTime.map(item => item.count),
            fill: true,
            backgroundColor: 'rgba(231, 76, 60, 0.2)', // Light red fill
            borderColor: 'rgba(231, 76, 60, 1)',      // Red line
            tension: 0.3,
            pointBackgroundColor: 'rgba(231, 76, 60, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(231, 76, 60, 1)',
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    } : null;

    // Annotations for Subscriptions Over Time
    const subscriptionAnnotations = stats?.subscriptionOverTime ? stats.subscriptionOverTime.reduce((acc, item, index) => {
        const count = item.count;
        if (count < 50) { // Low threshold
            acc[`low-${index}`] = {
                type: 'point',
                xValue: item._id,
                yValue: count,
                backgroundColor: 'rgba(231, 76, 60, 0.8)',
                borderColor: 'rgba(231, 76, 60, 1)',
                radius: 5,
                label: {
                    content: 'Low',
                    enabled: true,
                    position: 'top',
                    backgroundColor: 'rgba(231, 76, 60, 0.8)',
                    color: '#fff',
                    font: { size: 12 }
                }
            };
        } else if (count > 100) { // High threshold
            acc[`high-${index}`] = {
                type: 'point',
                xValue: item._id,
                yValue: count,
                backgroundColor: 'rgba(231, 76, 60, 0.8)',
                borderColor: 'rgba(231, 76, 60, 1)',
                radius: 5,
                label: {
                    content: 'High',
                    enabled: true,
                    position: 'top',
                    backgroundColor: 'rgba(231, 76, 60, 0.8)',
                    color: '#fff',
                    font: { size: 12 }
                }
            };
        }
        return acc;
    }, {
        normalRange: {
            type: 'box',
            yMin: 50,
            yMax: 100,
            backgroundColor: 'rgba(46, 204, 113, 0.1)', // Green shaded area for normal range
            borderColor: 'rgba(46, 204, 113, 0.3)',
            borderWidth: 1,
            label: {
                content: 'Normal Range (50-100)',
                enabled: true,
                position: 'center',
                color: 'rgba(46, 204, 113, 1)',
                font: { size: 12 }
            }
        }
    }) : {};

    const syncStatusData = stats ? {
        labels: ['Synced with Brevo', 'Unsynced'],
        datasets: [{
            label: 'Sync Status',
            data: [stats.syncedSubscribers, stats.unsyncedSubscribers],
            backgroundColor: [
                'rgba(52, 152, 219, 0.8)',
                'rgba(231, 76, 60, 0.8)'
            ],
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderWidth: 1,
            hoverBackgroundColor: [
                'rgba(52, 152, 219, 1)',
                'rgba(231, 76, 60, 1)'
            ]
        }]
    } : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8 rounded-2xl">
            <Toaster position="top-center" />
            <h1 className="text-3xl font-normal mb-10 text-center tracking-tight italic">Newsletter Subscribers Analytics Dashboard</h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-t-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
                </div>
            ) : !stats ? (
                <p className="text-center text-gray-400 text-lg">No data available.</p>
            ) : (
                <div className="space-y-12">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="flex justify-center items-center space-x-3">
                                <FaUsers className="w-8 h-8 text-orange-500" />
                                <div>
                                    <p className="text-sm font-normal text-gray-200">Total Subscribers</p>
                                    <p className="text-3xl font-normal text-orange-500">{stats.totalSubscribers}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="flex justify-center items-center space-x-3">
                                <FaCheckCircle className="w-8 h-8 text-green-500" />
                                <div>
                                    <p className="text-sm font-normal text-gray-200">Synced with Brevo</p>
                                    <p className="text-3xl font-normal text-green-500">{stats.syncedSubscribers}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="flex justify-center items-center space-x-3">
                                <FaTimesCircle className="w-8 h-8 text-red-500" />
                                <div>
                                    <p className="text-sm font-normal text-gray-200">Unsynced</p>
                                    <p className="text-3xl font-normal text-red-500">{stats.unsyncedSubscribers}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
                            <div className="flex justify-center items-center space-x-3">
                                <FaClock className="w-8 h-8 text-purple-500" />
                                <div>
                                    <p className="text-sm font-normal text-gray-200">Recent (Last 7 Days)</p>
                                    <p className="text-3xl font-normal text-purple-500">{stats.recentSubscribers}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Country Distribution (Bar Chart) */}
                        <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg border border-gray-700">
                            <h2 className="text-2xl font-normal mb-4 text-gray-100">Country Distribution</h2>
                            {countryChartData ? (
                                <div className="h-80">
                                    <Bar
                                        data={countryChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: false },
                                                title: {
                                                    display: true,
                                                    text: 'Subscribers by Country',
                                                    color: '#fff',
                                                    font: { size: 16, weight: '400' }
                                                },
                                                tooltip: {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                    titleFont: { size: 14 },
                                                    bodyFont: { size: 12 },
                                                    padding: 10
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    ticks: { color: '#A0AEC0', font: { size: 12 } },
                                                    grid: { display: false }
                                                },
                                                y: {
                                                    ticks: { color: '#A0AEC0', font: { size: 12 }, beginAtZero: true },
                                                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-400">No country distribution data available.</p>
                            )}
                        </div>

                        {/* Subscription Over Time (Hospital Blood Report Style) */}
                        <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg border border-gray-700">
                            <h2 className="text-2xl font-normal mb-4 text-gray-100">Subscriptions Over Time</h2>
                            {subscriptionOverTimeData ? (
                                <div className="h-80">
                                    <Line
                                        data={subscriptionOverTimeData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: { display: false },
                                                title: {
                                                    display: true,
                                                    text: 'Subscriptions Over Time (Last 30 Days)',
                                                    color: '#fff',
                                                    font: { size: 16, weight: '400' }
                                                },
                                                tooltip: {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                    titleFont: { size: 14 },
                                                    bodyFont: { size: 12 },
                                                    padding: 10
                                                },
                                                annotation: {
                                                    annotations: subscriptionAnnotations
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    ticks: { color: '#A0AEC0', font: { size: 12 } },
                                                    grid: { display: false }
                                                },
                                                y: {
                                                    ticks: { color: '#A0AEC0', font: { size: 12 }, beginAtZero: true },
                                                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                                    suggestedMin: 0,
                                                    suggestedMax: 150 // Adjust based on your data
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-400">No subscription data available.</p>
                            )}
                        </div>

                        {/* Sync Status (Pie Chart) */}
                        <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg border border-gray-700">
                            <h2 className="text-2xl font-normal mb-4 text-gray-100">Sync Status</h2>
                            {syncStatusData ? (
                                <div className="h-80">
                                    <Pie
                                        data={syncStatusData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                    labels: { color: '#fff', font: { size: 14 } }
                                                },
                                                title: {
                                                    display: true,
                                                    text: 'Brevo Sync Status',
                                                    color: '#fff',
                                                    font: { size: 16, weight: '400' }
                                                },
                                                tooltip: {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                    titleFont: { size: 14 },
                                                    bodyFont: { size: 12 },
                                                    padding: 10
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-400">No sync status data available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsletterStats;