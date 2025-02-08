'use client';

import Image from "next/image";
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {newsletters.map((newsletter) => (
                        <div
                            key={newsletter.id}
                            className="bg-white shadow-md rounded-lg overflow-hidden"
                        >
                            <Image
                                width={600}
                                height={200}
                                src={newsletter.image}
                                alt={newsletter.title}
                                className="w-full h-52 object-cover"
                               
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">
                                    {newsletter.title}
                                </h3>
                                <p className="text-gray-600">
                                    {newsletter.description.slice(0, 300)}...{" "}
                                    <span className="text-blue-500 cursor-pointer">
                                        Read More
                                    </span>
                                </p>
                                <div className="mt-4">
                                    <span className="text-sm text-gray-500 uppercase">
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
