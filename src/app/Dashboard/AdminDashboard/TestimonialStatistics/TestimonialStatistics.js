'use client';

import { useEffect, useState } from 'react';
import { FaStar, FaUsers, FaList } from 'react-icons/fa';
import ReactApexChart from 'react-apexcharts';

const TestimonialStatistics = () => {
    const [stats, setStats] = useState({ totalTestimonials: 0, averageRating: 0, categoryCount: {} });

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch('/api/testimonials');
                const data = await response.json();
                if (response.ok) {
                    const total = data.length;
                    const avgRating = (data.reduce((acc, t) => acc + (t.rating || 0), 0) / total).toFixed(1);
                    const categoryCount = data.reduce((acc, t) => {
                        const category = t.categories || 'Uncategorized';
                        acc[category] = (acc[category] || 0) + 1;
                        return acc;
                    }, {});
                    setStats({ totalTestimonials: total, averageRating: avgRating, categoryCount });
                }
            } catch (error) {
                console.error('Failed to fetch testimonial statistics:', error);
            }
        };
        fetchTestimonials();
    }, []);

    // Pie Chart Data
    const pieChartData = {
        series: Object.values(stats.categoryCount),
        options: {
            chart: {
                type: 'pie',
                height: 250, // Smaller chart
            },
            labels: Object.keys(stats.categoryCount),
            colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5', '#FF4500', '#32CD32'], // Different colors for each category
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                labels: {
                    colors: '#ffffff',
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            height: 200, // Smaller for mobile
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        },
    };

    return (

        <div className="bg-gray-900 rounded-lg p-4">
            
            <div className="max-w-4xl mx-auto p-4  text-white rounded-lg">
            <h2 className="text-lg font-bold mb-4 text-center">Testimonial Statistics</h2>

            {/* Pie Chart */}
            <div className="p-4 rounded-lg mb-4">
                <ReactApexChart options={pieChartData.options} series={pieChartData.series} type="pie" height={250} />
            </div>

            {/* Summary Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 ">
                {[
                    {
                        title: 'Total Testimonials',
                        value: stats.totalTestimonials,
                        icon: <FaUsers className=" text-gray-400" />,
                    },
                    {
                        title: 'Average Rating',
                        value: stats.averageRating,
                        icon: <FaStar className=" text-gray-400" />,
                    },
                    {
                        title: 'Categories',
                        value: Object.keys(stats.categoryCount).length,
                        icon: <FaList className=" text-gray-400" />,
                    },
                ].map(({ title, value, icon }, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded-lg"
                    >
                        <div className="mb-1">{icon}</div>
                        <h3 className="text-base ">{title}</h3>
                        <p className="">{value}</p>
                    </div>
                ))}
            </div>
        </div>
        </div>
        
    );
};

export default TestimonialStatistics;