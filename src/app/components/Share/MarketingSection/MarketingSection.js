'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaCode, FaSearch, FaStore, FaEnvelope, FaGlobeAmericas, FaPenAlt, FaArrowRight } from 'react-icons/fa';
import { FiPlay } from 'react-icons/fi';

const MarketingSection = () => {
    const services = [
        {
            title: "Web Development",
            description: "Custom, responsive websites built with React, Next.js, and modern frameworks for optimal performance.",
            icon: <FaCode className="w-5 h-5" />,
            color: "from-purple-500 to-indigo-600",
            bgColor: "bg-gradient-to-br from-purple-500/10 to-indigo-600/10",
            borderColor: "border-purple-500/20",
            link: "/web-development"
        },
        {
            title: "SEO Services",
            description: "Comprehensive SEO strategies to boost your rankings and organic traffic with measurable results.",
            icon: <FaSearch className="w-5 h-5" />,
            color: "from-blue-500 to-cyan-600",
            bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-600/10",
            borderColor: "border-blue-500/20",
            link: "/seo"
        },
        {
            title: "E-Commerce Shop",
            description: "Beautiful online stores with secure payments, inventory management, and conversion optimization.",
            icon: <FaStore className="w-5 h-5" />,
            color: "from-green-500 to-emerald-600",
            bgColor: "bg-gradient-to-br from-green-500/10 to-emerald-600/10",
            borderColor: "border-green-500/20",
            link: "/shop"
        },
        {
            title: "Newsletter Design",
            description: "Engaging email campaigns that convert, with stunning designs and analytics tracking.",
            icon: <FaEnvelope className="w-5 h-5" />,
            color: "from-red-500 to-pink-600",
            bgColor: "bg-gradient-to-br from-red-500/10 to-pink-600/10",
            borderColor: "border-red-500/20",
            link: "/letter"
        },
        {
            title: "Travel Storytelling",
            description: "Captivating travel content with professional photography and immersive storytelling.",
            icon: <FaGlobeAmericas className="w-5 h-5" />,
            color: "from-yellow-500 to-amber-600",
            bgColor: "bg-gradient-to-br from-yellow-500/10 to-amber-600/10",
            borderColor: "border-yellow-500/20",
            link: "/mesbahoffwego"
        },
        {
            title: "Content Creation",
            description: "High-quality blog posts, videos, and social media content tailored to your audience.",
            icon: <FaPenAlt className="w-5 h-5" />,
            color: "from-indigo-500 to-violet-600",
            bgColor: "bg-gradient-to-br from-indigo-500/10 to-violet-600/10",
            borderColor: "border-indigo-500/20",
            link: "/content-creation"
        }
    ];

    return (
        <section className="bg-gray-900 py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header - Improved */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
                    >
                        Professional Digital{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
                            Services
                        </span>
                    </motion.h2>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6 rounded-full"
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        Comprehensive solutions to elevate your online presence and drive sustainable growth
                    </motion.p>
                </motion.div>

                {/* Services Grid - Enhanced Design */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3 }
                            }}
                            className="group"
                        >
                            {/* Enhanced Card Design */}
                            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 lg:p-7 h-full transition-all duration-500 group-hover:border-gray-600/70 group-hover:shadow-2xl group-hover:shadow-purple-500/5 relative overflow-hidden">

                                {/* Background Gradient on Hover */}
                                <div className={`absolute inset-0 ${service.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10`} />

                                {/* Improved Icon Container */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className={`p-3 rounded-xl border ${service.borderColor} bg-gray-900/50 group-hover:bg-gray-900/70 transition-all duration-300`}>
                                        <div className={`text-white ${service.color.replace('from-', 'text-').replace(' to-', '')}`}>
                                            {service.icon}
                                        </div>
                                    </div>

                                    {/* Subtle Accent */}
                                    <div className={`w-2 h-2 rounded-full ${service.bgColor.replace('bg-gradient-to-br ', 'bg-').replace('/10', '/40')} mt-2`} />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                                    {service.title}
                                </h3>

                                <p className="text-gray-400 mb-6 leading-relaxed text-sm lg:text-base">
                                    {service.description}
                                </p>

                                {/* Enhanced Button */}
                                <Link
                                    href={service.link}
                                    className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 group/btn"
                                >
                                    <span className="mr-2">Explore Service</span>
                                    <div className={`p-1 rounded-lg ${service.bgColor} group-hover/btn:scale-110 transition-transform duration-300`}>
                                        <FaArrowRight className="w-3 h-3" />
                                    </div>
                                </Link>

                                {/* Bottom Border Animation */}
                                <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${service.color} group-hover:w-full transition-all duration-500 rounded-full`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Enhanced CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center mt-16 lg:mt-20"
                >
                    <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-2xl md:text-3xl font-bold text-white mb-4"
                    >
                        Ready to Start Your Project?
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto"
                    >
                        Let&#39;s collaborate to create something extraordinary that drives real results for your business
                    </motion.p>

                    {/* Your Original Button Style - Enhanced */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link
                            href="/contact"
                            className="group relative bg-gray-900/60 backdrop-blur-md border border-gray-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 hover:bg-gray-800/80 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden mx-auto w-fit"
                        >
                            {/* Enhanced Left Accent Bar */}
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-purple-400 to-purple-600 rounded-r-full group-hover:from-purple-300 group-hover:to-purple-500 group-hover:h-12 transition-all duration-300" />

                            {/* Enhanced Hover Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Animated Icon */}
                            <motion.div
                                animate={{ rotate: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <FiPlay className="relative group-hover:scale-110 transition-transform duration-300" />
                            </motion.div>

                            <span className="relative">Get Started Today</span>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default MarketingSection;