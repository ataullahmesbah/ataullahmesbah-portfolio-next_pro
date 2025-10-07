'use client';
import { FaCheckCircle, FaArrowRight, FaWordpress, FaNodeJs, FaShoppingCart, FaRocket, FaCode, FaShieldAlt, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

const WebTabs = () => {
    const webServices = [
        {
            id: 1,
            title: "Custom Website Development",
            description: "End-to-end full stack development for dynamic, scalable, and high-performing websites with custom functionalities built from scratch.",
            icon: <FaCode className="text-blue-400" />,
            slug: "/web-development"
        },
        {
            id: 2,
            title: "Ecommerce Website Solutions",
            description: "Build secure, conversion-focused online stores with inventory management, payment gateway integration, and custom checkout experiences.",
            icon: <FaShoppingCart className="text-purple-400" />,
            slug: "/web-development"
        },
        {
            id: 3,
            title: "Node.js & API Development",
            description: "Develop fast, scalable, and RESTful or GraphQL APIs using Node.js for real-time, data-driven web applications.",
            icon: <FaNodeJs className="text-green-500" />,
            slug: "/web-development"
        },
        {
            id: 4,
            title: "Website Speed & Core Vitals Optimization",
            description: "Boost website performance, optimize loading time, and improve Google Core Web Vitals to achieve higher search rankings.",
            icon: <FaRocket className="text-red-400" />,
            slug: "/web-development"
        },
        {
            id: 5,
            title: "SEO & Web Performance Enhancement",
            description: "Implement modern SEO techniques, structured data, and performance audits to ensure your site ranks and converts better.",
            icon: <FaChartLine className="text-yellow-400" />,
            slug: "/web-development"
        },
        {
            id: 6,
            title: "Website Security & Maintenance",
            description: "Regular updates, malware protection, server monitoring, and ongoing technical support to keep your site safe and stable.",
            icon: <FaShieldAlt className="text-pink-400" />,
            slug: "/web-development"
        }
    ];

    const benefits = [
        "Custom full-stack web solutions",
        "SEO-friendly architecture",
        "Optimized Core Web Vitals",
        "Mobile-first responsive design",
        "Secure hosting & SSL setup",
        "Ongoing technical maintenance"
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-3">
                        Professional Web Development Services
                    </h2>
                    <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
                        Tailored, secure, and performance-driven web solutions built for your business success and long-term growth.
                    </p>
                    <Link href="/web-development" className="inline-block mt-5 text-purple-300 hover:text-white transition-colors text-sm">
                        <span className="flex items-center justify-center gap-2">
                            Explore Full Services <FaArrowRight size={12} />
                        </span>
                    </Link>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
                    {webServices.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -6 }}
                            className="bg-gray-800/40 rounded-2xl p-6 border border-gray-700 hover:border-purple-500/40 transition-all duration-300 group shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm"
                        >
                            {/* Icon & Title */}
                            <div className="flex items-center gap-4 mb-4">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="bg-gray-700/50 p-3 rounded-xl group-hover:bg-purple-500/20 transition-colors"
                                >
                                    {service.icon}
                                </motion.div>
                                <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                                    {service.title}
                                </h3>
                            </div>

                            {/* Description */}
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                {service.description}
                            </p>

                            {/* Learn More Link */}
                            <Link
                                href={service.slug}
                                className="text-purple-400 hover:text-white flex items-center transition-colors text-sm font-medium"
                            >
                                Learn more
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={12} />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Benefits Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm"
                >
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-lg font-bold text-white mb-8">
                            Why Businesses Choose Mesbah for Web Development
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {benefits.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ x: 3 }}
                                    className="flex items-start justify-start text-left"
                                >
                                    <FaCheckCircle className="text-purple-400 mt-0.5 mr-3 flex-shrink-0" size={14} />
                                    <span className="text-gray-300 text-sm leading-snug">{item}</span>
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
