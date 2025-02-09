'use client';

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const Newsletters = () => {
    const [newsletters, setNewsletters] = useState([]);

    useEffect(() => {
        // Fetch newsletters data
        fetch("/newsletters.json")
            .then((response) => response.json())
            .then((data) => setNewsletters(data))
            .catch((error) => console.error("Error fetching newsletters:", error));
    }, []);

    return (
        <section className="py-16 px-6 bg-gray-800">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-10">
                    Our <span className="text-blue-500">Newsletters</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsletters.map((newsletter) => (
                        <div
                            key={newsletter.id}
                            className="bg-gray-900 shadow-lg shadow-purple-500/50 rounded-lg overflow-hidden hover:scale-105 hover:shadow-sky-800/50 transition-all duration-300"
                        >
                            {/* Image Section */}
                            <div className="w-full h-40 overflow-hidden relative">
                                <Image
                                    width={400}
                                    height={200}
                                    src={newsletter.image}
                                    alt={newsletter.title}
                                    className="w-full h-full object-fill"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>

                            {/* Content Section */}
                            <div className="p-4">
                                <h3 className="text-xl font-bold mb-2 text-white">
                                    {newsletter.title}
                                </h3>
                                <p className="text-gray-300 text-sm">
                                    {newsletter.description.slice(0, 300)}...{" "}
                                    <Link href={`/letter/${newsletter.id}`}>
                                        <span className="text-blue-400 cursor-pointer hover:underline">
                                            Read More
                                        </span>
                                    </Link>
                                </p>
                                <div className="mt-3">
                                    <span className="text-xs text-gray-400 uppercase">
                                        Category: {newsletter.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Newsletters;