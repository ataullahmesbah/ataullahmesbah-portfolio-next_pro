'use client';
import { motion } from 'framer-motion';
import { FaSearch, FaBullseye, FaShareAlt, FaPenNib, FaChartLine, FaCode } from 'react-icons/fa';

const MarketingSection = () => {
    const services = [
        {
            title: "SEO Optimization",
            description: "Boost your search rankings with our comprehensive SEO strategies tailored to your business goals.",
            icon: <FaSearch className="w-5 h-5" />,
            color: "from-blue-500 to-blue-600",
            link: "/seo-services"
        },
        {
            title: "Targeted Advertising",
            description: "Precision-targeted ad campaigns that convert visitors into customers with measurable ROI.",
            icon: <FaBullseye className="w-5 h-5" />,
            color: "from-green-500 to-green-600",
            link: "/advertising"
        },
        {
            title: "Social Media Strategy",
            description: "Engage your audience with data-driven social media campaigns across all platforms.",
            icon: <FaShareAlt className="w-5 h-5" />,
            color: "from-fuchsia-500 to-fuchsia-600",
            link: "/social-media"
        },
        {
            title: "Content Marketing",
            description: "Compelling content that tells your brand story and drives meaningful engagement.",
            icon: <FaPenNib className="w-5 h-5" />,
            color: "from-purple-500 to-purple-600",
            link: "/content-marketing"
        },
        {
            title: "Analytics & Insights",
            description: "Actionable data insights to refine your marketing strategy and maximize performance.",
            icon: <FaChartLine className="w-5 h-5" />,
            color: "from-amber-500 to-amber-600",
            link: "/analytics"
        },
        {
            title: "Technical Solutions",
            description: "Cutting-edge technical implementations to support your digital marketing infrastructure.",
            icon: <FaCode className="w-5 h-5" />,
            color: "from-cyan-500 to-cyan-600",
            link: "/technical"
        }
    ];

    return (
        <section className="bg-gray-900 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Digital Marketing <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Excellence</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Data-driven strategies that deliver measurable results and sustainable growth for your business.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col h-full"
                        >
                            <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group">
                                {/* Gradient Header */}
                                <div className={`bg-gradient-to-r ${service.color} h-2 w-full`}></div>

                                {/* Service Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <motion.div
                                        whileHover={{ rotate: 10, scale: 1.1 }}
                                        className={`mb-5 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${service.color} text-white`}
                                    >
                                        {service.icon}
                                    </motion.div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{service.title}</h3>
                                    <p className="text-gray-300 mb-6 flex-1">{service.description}</p>

                                    {/* Button Container */}
                                    <div className="mt-auto pt-4">
                                        <motion.div
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="relative inline-block w-fit"
                                        >
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                                            <a
                                                href={service.link}
                                                className="relative px-5 py-2.5 bg-gray-700 rounded-lg text-white font-medium inline-flex items-center justify-center gap-2 hover:bg-gray-600 transition-all text-sm border border-gray-600 group-hover:border-transparent"
                                            >
                                                Explore Service
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                </svg>
                                            </a>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <h3 className="text-2xl font-bold text-white mb-6">Ready to transform your digital presence?</h3>
                    <motion.a
                        href="/contact"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-block px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white  rounded-lg shadow-lg hover:shadow-xl transition-all text-base"
                    >
                        Get Your Free Consultation
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default MarketingSection;