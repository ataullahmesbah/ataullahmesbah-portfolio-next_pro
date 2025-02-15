"use client";
import { useEffect, useState } from "react";
import { FaStar, FaUsers, FaList } from "react-icons/fa";
import { motion } from "framer-motion";

const TestimonialStatistics = () => {
    const [stats, setStats] = useState({ totalTestimonials: 0, averageRating: 0, categoryCount: {} });

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

                    setStats({ totalTestimonials: total, averageRating: avgRating, categoryCount });
                }
            } catch (error) {
                console.error("Failed to fetch testimonial statistics:", error);
            }
        };
        fetchTestimonials();
    }, []);

    const cardVariants = {
        hover: { scale: 1.05, rotate: 360, transition: { duration: 0.5 } }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg border-l-4 border-b-4 border-b-sky-500 border-l-purple-500">
            <h2 className="text-2xl font-bold mb-6 text-center">Testimonial Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[{
                    title: "Total Testimonials", value: stats.totalTestimonials, icon: <FaUsers className="text-3xl" />
                }, {
                    title: "Average Rating", value: stats.averageRating, icon: <FaStar className="text-3xl text-yellow-500" />
                }, {
                    title: "Category Count", value: (
                        <ul>
                            {Object.entries(stats.categoryCount).map(([category, count]) => (
                                <li key={category} className="text-sm">
                                    <span className="text-base  font-semibold">{category}:</span> {count}
                                </li>
                            ))}
                        </ul>
                    ), icon: <FaList className="text-3xl " />
                }].map(({ title, value, icon }, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover="hover"
                        className="flex flex-col items-center justify-center  p-4 bg-gray-700 border-4 shadow-fuchsia-500 border-gray-600 rounded-lg shadow-lg transition-transform"
                    >
                        <div className="mb-2">{icon}</div>
                        <h3 className="text-lg">{title}</h3>
                        <p className="text-xl">{value}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TestimonialStatistics;
