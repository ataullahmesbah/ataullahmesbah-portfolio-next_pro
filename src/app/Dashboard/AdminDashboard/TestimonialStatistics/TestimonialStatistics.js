"use client";
import { useEffect, useState } from "react";
import { FaStar, FaUsers, FaList } from "react-icons/fa";

const TestimonialStatistics = () => {
    const [stats, setStats] = useState({
        totalTestimonials: 0,
        averageRating: 0,
        categoryCount: {},
    });

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch("/api/testimonials");
                const data = await response.json();

                if (response.ok) {
                    const total = data.length;
                    const avgRating = (data.reduce((acc, t) => acc + (t.rating || 0), 0) / total).toFixed(1);

                    const categoryCount = data.reduce((acc, t) => {
                        const category = t.categories || "Uncategorized";
                        acc[category] = (acc[category] || 0) + 1;
                        return acc;
                    }, {});

                    setStats({
                        totalTestimonials: total,
                        averageRating: avgRating,
                        categoryCount,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch testimonial statistics:", error);
            }
        };

        fetchTestimonials();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Testimonial Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Testimonials */}
                <div className="flex items-center justify-center p-4 bg-blue-600 rounded-lg shadow">
                    <FaUsers className="text-3xl mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">Total Testimonials</h3>
                        <p className="text-xl font-bold">{stats.totalTestimonials}</p>
                    </div>
                </div>

                {/* Average Rating */}
                <div className="flex items-center justify-center p-4 bg-green-600 rounded-lg shadow">
                    <FaStar className="text-3xl mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold">Average Rating</h3>
                        <p className="text-xl font-bold">{stats.averageRating}</p>
                    </div>
                </div>

                {/* Categories Count */}
                <div className="p-4 bg-purple-600 rounded-lg shadow">
                    <div className="flex items-center mb-2">
                        <FaList className="text-3xl mr-4" />
                        <h3 className="text-lg font-semibold">Category Count</h3>
                    </div>
                    <ul>
                        {Object.entries(stats.categoryCount).map(([category, count]) => (
                            <li key={category} className="text-sm">
                                <span className="font-bold">{category}:</span> {count}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TestimonialStatistics;
