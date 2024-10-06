'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa'; // Importing icon for bullet points

const SEOPackage = () => {
    // State to store packages data
    const [packagesData, setPackagesData] = useState([]);

    // Fetch data from JSON file on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/seopackages.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setPackagesData(data);
            } catch (error) {
                console.error('Error fetching packages data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 poppins-regular">
                <h1 className="text-3xl  text-center text-gray-100 mb-12">
                    SEO Packages
                </h1>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {packagesData.map((pkg) => (
                        <div
                            key={pkg._id}
                            className="
                                relative flex flex-col h-full 
                                bg-gray-800 border-e-purple-600 border-e-4 shadow-md shadow-blue-500 hover:shadow-2xl hover:shadow-blue-500 rounded-lg p-6  transition-transform transform hover:scale-105 duration-1000 poppins-regular
                            "
                        >
                            <h2 className="text-2xl font-bold text-gray-100">{pkg.name}</h2>
                            <p className="mt-4 text-gray-300">{pkg.description}</p>
                            <ul className="mt-4 space-y-2">
                                {pkg.features.map((feature, index) => (
                                    <li key={index} className="text-gray-300 flex items-center">
                                        <FaCheckCircle className="text-white mr-2" /> {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Spacer to push content to the bottom */}
                            <div className="flex-grow"></div>

                            {/* Pricing section */}
                            <div className="flex items-center gap-5 mt-4">
                                <p className="text-2xl font-semibold text-white">${pkg.discount.toLocaleString()}</p>
                                {pkg.discount < pkg.price && (
                                    <p className="text-red-400 text-xl line-through">${pkg.price.toLocaleString()}</p>
                                )}
                            </div>

                            {/* Contact button */}


                            <div className="py-2 mt-4 w-full">
                                <div className="relative group w-full">
                                    <div className="absolute inset-0 w-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                                    <button className="relative w-full px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center">
                                        <a href='/contact' className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200 w-full text-center">Contact &rarr;</a>
                                    </button>
                                </div>
                            </div>



                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SEOPackage;
