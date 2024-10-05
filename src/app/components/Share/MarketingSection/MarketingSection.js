'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaSearch, FaBullseye, FaShareAlt, FaPenNib, FaChartLine, FaCode } from 'react-icons/fa';

const iconMap = {
    FaSearch: <FaSearch className="text-blue-600 w-12 h-12" />,
    FaBullseye: <FaBullseye className="text-green-500 w-12 h-12" />,
    FaShareAlt: <FaShareAlt className="text-pink-500 w-12 h-12" />,
    FaPenNib: <FaPenNib className="text-purple-500 w-12 h-12" />,
    FaChartLine: <FaChartLine className="text-yellow-500 w-12 h-12" />,
    FaCode: <FaCode className="text-sky-900 w-12 h-12" />,
};

const MarketingSection = () => {
    const [services, setServices] = useState([]);

    // Fetching the services data from JSON file
    useEffect(() => {
        fetch('/marketingdata.json')
            .then((response) => response.json())
            .then((data) => setServices(data))
            .catch((error) => console.error('Error fetching services:', error));
    }, []);

    return (
        // <div className="bg-white py-16 px-4 poppins-regular">
        <div className="text-white py-16 px-4 poppins-regular">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-gray-200">Showcasing My Digital Marketing Expertise</h2>
                <p className="mt-4 text-lg text-gray-300">
                    Leveraging years of experience to deliver comprehensive digital strategies that drive results and elevate brands.
                </p>
            </div>
            {/*  */}
            <div className="mt-12 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 border-e-purple-600 border-e-4 shadow-md shadow-blue-500 hover:shadow-2xl hover:shadow-blue-500 rounded-lg p-6 text-center transition-transform transform hover:scale-105 duration-1000"
                    >
                        <div className="flex justify-center mb-4">
                            {iconMap[service.icon]}
                        </div>
                        <h3 className="text-xl font-bold text-text">{service.title}</h3>
                        <p className="mt-4 text-gray-200">{service.description}</p>




                        <div className="py-5">
                            <div className="grid gap-8 justify-center items-center">
                                <div className="relative group">

                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>


                                    <button
                                        type="submit"
                                        className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center">

                                        <a href={service.link} className=" text-indigo-400 group-hover:text-gray-100 transition duration-200">See More</a>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketingSection;
