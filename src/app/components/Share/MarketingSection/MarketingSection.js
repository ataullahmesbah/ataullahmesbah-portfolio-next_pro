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
                <h2 className="text-3xl font-extrabold text-gray-900">Showcasing My Digital Marketing Expertise</h2>
                <p className="mt-4 text-lg text-gray-600">
                    Leveraging years of experience to deliver comprehensive digital strategies that drive results and elevate brands.
                </p>
            </div>
            <div className="mt-12 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-lg p-6 text-center transition-transform transform hover:scale-105"
                    >
                        <div className="flex justify-center mb-4">
                            {iconMap[service.icon]}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                        <p className="mt-4 text-gray-600">{service.description}</p>


                        <button className="mt-6 px-5 py-2 border-2 border-sky-800   text-black font-medium rounded-md hover:bg-sky-900  hover:text-white transition">
                            <Link href={service.link} >
                                Learn More
                            </Link >
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MarketingSection;
