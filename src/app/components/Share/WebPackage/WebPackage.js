'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa'; // Importing icon for bullet points

const WebPackage = () => {
    // State to store packages data
    const [packagesData, setPackagesData] = useState([]);

    // Fetch data from JSON file on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/webpackage.json');
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
                    Web Service Packages
                </h1>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
                    {packagesData.map((pkg) => (
                        <div key={pkg._id} className="relative bg-white shadow-md rounded-lg p-6 flex flex-col h-full ">
                            <h2 className="text-2xl font-bold  text-gray-800">{pkg.name}</h2>
                            <p className="mt-4 text-gray-600 ">{pkg.description}</p>
                            <ul className="mt-4 space-y-2">
                                {pkg.features.map((feature, index) => (
                                    <li key={index} className="text-gray-600 flex items-center">
                                        <FaCheckCircle className="text-sky-700 mr-2" /> {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Spacer to push content to the bottom */}
                            <div className="flex-grow"></div>

                            {/* Pricing section */}
                            <div className="flex items-center gap-2 mt-4">
                                <p className="text-xl font-bold text-sky-700">${pkg.discount.toLocaleString()}</p>
                                {pkg.discount < pkg.price && (
                                    <p className="text-red-500 line-through">${pkg.price.toLocaleString()}</p>
                                )}
                            </div>

                            {/* Contact button */}
                            <div className="mt-4">
                                <Link href="/contact">
                                    <button className="w-full px-6 py-2 bg-sky-700 text-white rounded hover:bg-opacity-75 hover:bg-sky-800 transition duration-300 ease-in-out">
                                        Contact
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WebPackage;
