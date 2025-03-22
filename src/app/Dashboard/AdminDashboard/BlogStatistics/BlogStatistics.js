'use client';

import Loading from '@/app/loading';
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

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
                if (!response.ok) {
                    throw new Error('Failed to fetch statistics');
                }
                const data = await response.json();
                setStatistics(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);


    const incrementViews = (index) => {
        setStatistics((prev) => {
            const updatedPopularBlogs = [...prev.popularBlogs];
            updatedPopularBlogs[index].views = String(parseInt(updatedPopularBlogs[index].views || 0) + 1);
            return { ...prev, popularBlogs: updatedPopularBlogs };
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    const categoryChartData = [
        ['Category', 'Number of Blogs'],
        ...statistics.blogsByCategory.map((category) => [category._id, parseInt(category.count)]),
    ];


    const popularBlogsChartData = [
        ['ID', 'Views', { role: 'tooltip', type: 'string' }],
        ...statistics.popularBlogs.map((blog, index) => [
            index + 1,
            parseInt(blog.views || 0),
            `Title: ${blog.title}\nViews: ${blog.views || 0}`,
        ]),
    ];


    const latestBlogsChartData = [
        ['Date', 'Views'],
        ...statistics.latestBlogs.map((blog) => [
            new Date(blog.publishDate).toLocaleDateString(),
            parseInt(blog.views || 0),
        ]),
    ];

    return (
        <div className="p-6  text-white">



            <div className="bg-gray-700 p-4 rounded-lg shadow-md mb-6">
                <h2 className="text-base mb-2">Total Blog Posts</h2>
                <p className="text-3xl">{statistics.totalBlogs}</p>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">


                <div className=" p-4 rounded-lg ">
                    <h2 className=" mb-4">Blogs by Category</h2>
                    <Chart
                        width={'100%'}
                        height={'300px'}
                        chartType="BarChart"
                        loader={<div>Loading Chart</div>}
                        data={categoryChartData}
                        options={{
                            legend: { position: 'none' },
                            hAxis: { title: 'Number of Blogs', minValue: 0, textStyle: { color: '#FFF' }, titleTextStyle: { color: '#FFF' } },
                            vAxis: { title: 'Category', textStyle: { color: '#FFF' }, titleTextStyle: { color: '#FFF' } },
                            bar: { groupWidth: '50%' },
                            backgroundColor: '#111827', // bg-gray-700
                            chartArea: { backgroundColor: '#111827' }, // bg-gray-700
                            titleTextStyle: { color: '#FFF' },
                           
                        }}
                    />
                </div>


                <div className=" p-4 rounded-lg ">
                    <h2 className=" mb-4">Popular Blog Posts</h2>
                    <Chart
                        width={'100%'}
                        height={'300px'}
                        chartType="ColumnChart"
                        loader={<div>Loading Chart</div>}
                        data={popularBlogsChartData}
                        options={{
                            legend: { position: 'none' },
                            hAxis: { title: 'Blog ID', textStyle: { color: '#FFF' }, titleTextStyle: { color: '#FFF' } },
                            vAxis: { title: 'Views', minValue: 0, textStyle: { color: '#FFF' }, titleTextStyle: { color: '#FFF' } },
                            tooltip: { isHtml: true },
                            backgroundColor: '#111827',
                            chartArea: { backgroundColor: '#111827' },
                            titleTextStyle: { color: '#FFF' },
                        }}
                    />

                </div>


                <div className=" p-4 rounded-lg ">
                    <h2 className=" mb-4">Latest Blog Posts</h2>
                    <Chart
                        width={'100%'}
                        height={'300px'}
                        chartType="LineChart"
                        loader={<div>Loading Chart</div>}
                        data={latestBlogsChartData}
                        options={{
                            legend: { position: 'none' },
                            hAxis: { title: 'Date', textStyle: { color: '#FFF' }, titleTextStyle: { color: '#FFF' } },
                            vAxis: { title: 'Views', minValue: 0, textStyle: { color: '#FFF' }, titleTextStyle: { color: '#FFF' } },
                            backgroundColor: '#111827', // bg-gray-700
                            chartArea: { backgroundColor: '#111827' }, // bg-gray-700
                            titleTextStyle: { color: '#FFF' },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default BlogStatisticsDashboard;