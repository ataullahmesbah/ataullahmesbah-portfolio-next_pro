'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend);

export default function TravelStatistics() {
    const [travels, setTravels] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch travel data
    const fetchTravels = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/travel');
            setTravels(res.data);
            toast.success('Travel data loaded');
        } catch (error) {
            toast.error('Failed to fetch travel data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTravels();
    }, []);

    // Calculate statistics
    const totalTravels = travels.length;
    const categoryCounts = travels.reduce((acc, travel) => {
        acc[travel.category] = (acc[travel.category] || 0) + 1;
        return acc;
    }, {});
    const locationCounts = travels.reduce((acc, travel) => {
        acc[travel.location] = (acc[travel.location] || 0) + 1;
        return acc;
    }, {});
    const timelineData = travels.reduce((acc, travel) => {
        const date = new Date(travel.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    // Chart data with consistent colors
    const colors = {
        purple: '#9333ea',
        indigo: '#4f46e5',
        cyan: '#06b6d4',
        orange: '#f97316',
        red: '#ef4444'
    };

    const categoryChartData = {
        labels: Object.keys(categoryCounts),
        datasets: [{
            label: 'Travels by Category',
            data: Object.values(categoryCounts),
            backgroundColor: [colors.purple, colors.indigo, colors.cyan],
            borderColor: ['#fff'],
            borderWidth: 1,
        }],
    };

    const locationChartData = {
        labels: Object.keys(locationCounts),
        datasets: [{
            label: 'Travels by Location',
            data: Object.values(locationCounts),
            backgroundColor: Object.keys(locationCounts).map((_, i) => 
                [colors.purple, colors.indigo, colors.cyan, colors.orange, colors.red][i % 5]
            ),
            borderColor: '#fff',
            borderWidth: 1,
        }],
    };

    const timelineChartData = {
        labels: Object.keys(timelineData).sort((a, b) => new Date(a) - new Date(b)),
        datasets: [{
            label: 'Travels Over Time',
            data: Object.values(timelineData),
            fill: false,
            borderColor: colors.purple,
            backgroundColor: colors.purple,
            tension: 0.1,
            pointBackgroundColor: '#fff',
            pointBorderColor: colors.purple,
        }],
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl font-semibold animate-pulse">
                    Loading statistics...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8 text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Travel Statistics Dashboard
                    </h1>
                    <p className="text-gray-300">Visual insights into your travel data</p>
                    <div className="w-20 h-1 bg-purple-500 mx-auto mt-4 rounded-full"></div>
                </header>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
                        <h3 className="text-gray-300 text-sm font-medium">Total Travels</h3>
                        <p className="text-2xl font-bold text-purple-400">{totalTravels}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
                        <h3 className="text-gray-300 text-sm font-medium">Unique Categories</h3>
                        <p className="text-2xl font-bold text-indigo-400">{Object.keys(categoryCounts).length}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
                        <h3 className="text-gray-300 text-sm font-medium">Locations Visited</h3>
                        <p className="text-2xl font-bold text-cyan-400">{Object.keys(locationCounts).length}</p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Category Chart */}
                    <div className="bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Travels by Category</h2>
                        <div className="h-64 md:h-80">
                            <Bar
                                data={categoryChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                            labels: {
                                                color: '#e5e7eb',
                                                font: {
                                                    size: 14
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        x: {
                                            grid: {
                                                color: 'rgba(255,255,255,0.1)'
                                            },
                                            ticks: {
                                                color: '#e5e7eb'
                                            }
                                        },
                                        y: {
                                            grid: {
                                                color: 'rgba(255,255,255,0.1)'
                                            },
                                            ticks: {
                                                color: '#e5e7eb'
                                            },
                                            beginAtZero: true
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Location Chart */}
                    <div className="bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Travels by Location</h2>
                        <div className="h-64 md:h-80">
                            <Pie
                                data={locationChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'right',
                                            labels: {
                                                color: '#e5e7eb',
                                                font: {
                                                    size: 12
                                                },
                                                padding: 16
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Timeline and Data Summary - Flex layout */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    {/* Timeline Chart - Now in flex container */}
                    <div className="flex-1 bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Travels Timeline</h2>
                        <div className="h-64 md:h-96">
                            <Line
                                data={timelineChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            labels: {
                                                color: '#e5e7eb',
                                                font: {
                                                    size: 14
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        x: {
                                            grid: {
                                                color: 'rgba(255,255,255,0.1)'
                                            },
                                            ticks: {
                                                color: '#e5e7eb'
                                            }
                                        },
                                        y: {
                                            grid: {
                                                color: 'rgba(255,255,255,0.1)'
                                            },
                                            ticks: {
                                                color: '#e5e7eb'
                                            },
                                            beginAtZero: true
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Data Summary - Now in table format */}
                    <div className="flex-1 bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700">
                        <h2 className="text-xl font-semibold text-white mb-4">Data Summary</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Count</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {Object.entries(categoryCounts).map(([category, count]) => (
                                        <tr key={category}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{category}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-purple-400">{count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Location</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Visits</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {Object.entries(locationCounts)
                                        .sort((a, b) => b[1] - a[1])
                                        .slice(0, 5)
                                        .map(([location, count]) => (
                                            <tr key={location}>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-200">{location}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-400">{count}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}