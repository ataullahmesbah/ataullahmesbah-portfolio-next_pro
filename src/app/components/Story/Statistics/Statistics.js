'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import Image from 'next/image';
import Link from 'next/link';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function StatisticsClient({ stats }) {
    const [loading] = useState(false);

    // Chart data configuration
    const categoryChartData = {
        labels: stats.categoryCounts.map(c => c.category),
        datasets: [{
            data: stats.categoryCounts.map(c => c.count),
            backgroundColor: [
                '#6366F1', // Indigo
                '#10B981', // Emerald
                '#F59E0B', // Amber
                '#EF4444', // Red
                '#8B5CF6', // Violet
            ],
            borderWidth: 0,
        }],
    };

    const storiesOverTimeChartData = {
        labels: stats.storiesOverTime.map(s => s.date),
        datasets: [{
            label: 'Stories Published',
            data: stats.storiesOverTime.map(s => s.count),
            backgroundColor: '#6366F1',
            borderRadius: 6,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#9CA3AF',
                    font: {
                        size: 12,
                        family: 'Inter'
                    },
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: '#1F2937',
                titleColor: '#F3F4F6',
                bodyColor: '#D1D5DB',
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                borderColor: '#374151',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: '#9CA3AF'
                }
            },
            y: {
                grid: {
                    color: '#374151',
                    drawBorder: false
                },
                ticks: {
                    color: '#9CA3AF',
                    stepSize: 1
                }
            }
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Story Analytics Dashboard</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Comprehensive insights into your story performance and engagement metrics
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <MetricCard
                                title="Total Stories"
                                value={stats.totalStories}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                }
                                color="bg-indigo-500"
                            />

                            <MetricCard
                                title="Total Views"
                                value={stats.totalViews}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                }
                                color="bg-emerald-500"
                            />

                            <MetricCard
                                title="Published"
                                value={stats.statusCounts.published || 0}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                }
                                color="bg-amber-500"
                            />

                            <MetricCard
                                title="Drafts"
                                value={stats.statusCounts.draft || 0}
                                icon={
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                }
                                color="bg-rose-500"
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <ChartCard title="Stories by Category">
                                <div className="h-72">
                                    <Pie
                                        data={categoryChartData}
                                        options={chartOptions}
                                    />
                                </div>
                            </ChartCard>

                            <ChartCard title="Stories Published (Last 30 Days)">
                                <div className="h-72">
                                    <Bar
                                        data={storiesOverTimeChartData}
                                        options={{
                                            ...chartOptions,
                                            plugins: {
                                                ...chartOptions.plugins,
                                                legend: {
                                                    display: false
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </ChartCard>
                        </div>

                        {/* Top Stories Table */}
                        <ChartCard title="Top 5 Viewed Stories" className="overflow-hidden">
                            {stats.topStories.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-400">No stories available</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead className="bg-gray-800">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Story
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Views
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-gray-900 divide-y divide-gray-700">
                                            {stats.topStories.map((story) => (
                                                <tr key={story._id} className="hover:bg-gray-800 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                                                                <Image
                                                                    src={story.mainImage || '/images/placeholder.jpg'}
                                                                    alt={story.title}
                                                                    width={40}
                                                                    height={40}
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-white">{story.title}</div>
                                                                <div className="text-sm text-gray-400">{story.category}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                        {story.views}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link href={`/admin-dashboard/story/edit-featured-story/${story.slug}`}>
                                                            <button className="text-indigo-400 hover:text-indigo-300 mr-4">
                                                                Edit
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </ChartCard>
                    </div>
                )}
            </div>
        </>
    );
}

// Reusable Metric Card Component
const MetricCard = ({ title, value, icon, color }) => (
    <div className="bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-700 hover:border-gray-600 transition-colors">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
            </div>
            <div className={`${color} p-3 rounded-lg text-white`}>
                {icon}
            </div>
        </div>
    </div>
);

// Reusable Chart Card Component
const ChartCard = ({ title, children, className = '' }) => (
    <div className={`bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-700 ${className}`}>
        <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
        {children}
    </div>
);