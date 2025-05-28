'use client';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Import your JSON data directly (recommended approach)
import webServicesData from '/public/webtabs.json';

const WebTabs = () => {
    const [webServices, setWebServices] = useState([]);

    useEffect(() => {
        // Option 1: Directly use imported data (fastest)
        setWebServices(webServicesData);
         }, []);

    // useEffect(() => {
    //     fetch("/webtabs.json")
    //         .then((response) => response.json())
    //         .then((data) => setWebServices(data))
    //         .catch((error) => console.error("Error fetching web services:", error));
    // }, []);

    return (
        <section className="py-10  px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                        Web Development Services
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Professional web solutions tailored for your business growth
                    </p>
                    <Link href="/web-development" className="inline-block mt-6 text-purple-300 hover:text-white transition-colors">
                        <span className="flex items-center">
                            View all web services <FaArrowRight className="ml-2" />
                        </span>
                    </Link>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {webServices.map((service, index) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group"
                        >
                            <div className="flex items-start mb-6">
                                <motion.div 
                                    whileHover={{ rotate: 10 }}
                                    className="bg-purple-500/10 p-3 rounded-xl mr-4"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                                        {service.title.charAt(0)}
                                    </div>
                                </motion.div>
                                <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                                    {service.title}
                                </h3>
                            </div>
                            <p className="text-gray-300 mb-6">{service.description}</p>
                            <Link 
                                href="/web-development" 
                                className="text-purple-400 hover:text-white flex items-center transition-colors"
                            >
                                Learn more <FaArrowRight className="ml-2" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Benefits Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-gray-800/30 rounded-xl p-8 border border-gray-700 backdrop-blur-sm"
                >
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-8 text-center">
                            Why Choose Our Web Development Services?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                "Custom website development",
                                "SEO-friendly architecture",
                                "Mobile-responsive design",
                                "Secure & scalable solutions",
                                "24/7 technical support",
                                "Performance optimization",
                                "Modern UI/UX design",
                                "E-commerce integration",
                                "CMS implementation"
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 5 }}
                                    className="flex items-start"
                                >
                                    <FaCheckCircle className="text-purple-400 mt-1 mr-3 flex-shrink-0" />
                                    <span className="text-gray-300">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WebTabs;