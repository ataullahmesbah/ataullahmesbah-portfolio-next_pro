'use client';

import React, { useState, useEffect } from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const LetterReview = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        fetch("/letterreview.json")
            .then((response) => response.json())
            .then((data) => setTestimonials(data))
            .catch((error) => console.error("Error fetching testimonials:", error));
    }, []);

    return (
        <section className="py-16 px-4 sm:px-6 bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex justify-between  items-center mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 text-center mx-auto to-blue-500 bg-clip-text text-transparent ">
                            Client Testimonials
                        </h1>

                    </div>

                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Hear what people are saying about their experience
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-xl p-6 transition-all duration-300"
                        >
                            <div className="flex flex-col h-full">
                                <FaQuoteLeft className="text-blue-400 text-2xl mb-4 opacity-70" />
                                <p className="text-gray-300 mb-6 flex-grow italic">
                                    {testimonial.quote}
                                </p>
                                <div className="mt-auto">
                                    <div className="flex justify-center mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className="text-yellow-400" />
                                        ))}
                                    </div>
                                    <h4 className="font-semibold text-white text-center">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-gray-400 text-sm text-center">
                                        {testimonial.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LetterReview;