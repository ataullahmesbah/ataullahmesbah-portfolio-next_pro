'use client';

import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const LetterReview = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        // Fetch data from the JSON file
        fetch("/letterreview.json")
            .then((response) => response.json())
            .then((data) => setTestimonials(data))
            .catch((error) => console.error("Error fetching testimonials:", error));
    }, []);

    return (
        <section className="py-16 px-6 bg-gray-900">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold text-white mb-8">
                    What Our <span className="text-blue-500">Current Readers</span> Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 text-white rounded-lg shadow-lg p-6 flex flex-col items-center"
                        >
                            <p className="text-lg text-center italic mb-4">{testimonial.quote}</p>
                            <div className="flex items-center space-x-2 text-yellow-400 mb-4">
                                {Array(5)
                                    .fill()
                                    .map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                            </div>
                            <h4 className="font-bold text-lg">{testimonial.name}</h4>
                            <p className="text-sm text-gray-400">{testimonial.location}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LetterReview;
