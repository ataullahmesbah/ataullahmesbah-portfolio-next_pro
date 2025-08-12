import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';

const SEOTabs = () => {
    const [seoServices, setSeoServices] = useState([
        { id: 1, title: "Off-Page SEO", slug: "/seo" },
        { id: 2, title: "On-Page SEO", slug: "/seo" },
        { id: 3, title: "Keyword Research", slug: "/seo" },
        { id: 4, title: "Technical SEO", slug: "/seo" },
        { id: 5, title: "Local SEO", slug: "/seo" },
        { id: 6, title: "Link Building", slug: "/seo" }
    ]);

    return (
        <main className="max-w-7xl mx-auto px-4 py-12">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Search Engine <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Optimization</span>
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl">
                    Rank higher in search engines and get more qualified visitors with our proven SEO strategies.
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-purple-600 mt-4 rounded-full" />
            </motion.div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Services Tabs */}
                <div className="grid grid-cols-2 gap-4">
                    {seoServices.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Link href={service.slug} passHref>
                                <div className="bg-gray-800 hover:bg-gray-700/80 border border-gray-700 hover:border-purple-400/30 rounded-xl p-6 transition-all duration-300 cursor-pointer h-full">
                                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                                        {service.title}
                                        <FaArrowRight className="ml-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h3>
                                    <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent mt-2" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Why Choose Me Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900/80 border border-gray-700 rounded-xl p-6 shadow-lg"
                >
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Why Choose My <span className="text-purple-400">SEO Services</span>?
                    </h3>
                    <ul className="space-y-4">
                        {[
                            "Custom SEO strategies tailored to your business goals",
                            "Proven track record of top rankings",
                            "White-hat techniques only - sustainable results",
                            "Detailed reporting and transparent communication",
                            "Continuous optimization based on data"
                        ].map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                className="flex items-start text-gray-300"
                            >
                                <FaCheckCircle className="text-purple-400 mt-1 mr-3 flex-shrink-0" />
                                <span>{item}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </div>
        </main>
    );
};

export default SEOTabs;