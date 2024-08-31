'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const WebTabs = () => {
    // State to store web development services data
    const [webServices, setWebServices] = useState([]);

    // Fetch web development services data from the JSON file
    useEffect(() => {
        fetch("/webtabs.json")
            .then((response) => response.json())
            .then((data) => setWebServices(data))
            .catch((error) => console.error("Error fetching web services:", error));
    }, []);

    return (
        <main className="p-4 poppins-regular">
            {/* Web Development Section Title and Description */}
            <div className="text-left mb-8">
                <h3 className="text-3xl font-bold mb-2">Web Development Services</h3>
                <p className="text-gray-600">Build and enhance your online presence with our expert web development services.</p>
            </div>

            {/* Web Services and Right Section Wrapper */}
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                {/* Left Section: Web Services */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {webServices.map((service) => (
                        <div
                            key={service._id}
                            className="flex flex-col space-y-4 bg-gray-200 hover:text-blue-600 items-center justify-center shadow-md shadow-blue-500 rounded-lg p-4 text-center hover:shadow-md hover:border-blue-800 hover:shadow-blue-500 transition duration-300 ease-linear transform hover:scale-105"
                        >
                            <Image
                                className="w-12 h-12"
                                src={service.image}
                                alt={service.title}
                                width={50}
                                height={50}
                            />
                            <h3 className="text-sm text-gray-800 font-semibold">{service.title}</h3>
                            <p className="text-xs text-gray-600">{service.description}</p>
                        </div>
                    ))}
                </div>

                {/* Right Section: Benefits of Web Development */}
                <div className="lg:w-1/2 space-y-6">
                    <div className="bg-white shadow-lg p-6 rounded-lg text-left">
                        <h3 className="text-2xl font-bold text-blue-800">
                            Why Choose Us for Web Development?
                        </h3>
                        <p className="text-gray-700 mt-4">
                            Our web development services are designed to create a seamless and engaging user experience while meeting your business goals.
                        </p>
                        <ul className="list-none pl-0 mt-4 text-gray-700 space-y-2">
                            {[
                                "Custom website development tailored to your business needs",
                                "SEO-friendly design to improve your online visibility",
                                "Responsive design for all devices",
                                "Secure and scalable solutions",
                                "Continuous support and maintenance"
                            ].map((item, index) => (
                                <li key={index} className="flex items-center group">
                                    <FaCheckCircle className="text-blue-800 mr-2" />
                                    <span className="group-hover:text-blue-800 transition-colors duration-300">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default WebTabs;
