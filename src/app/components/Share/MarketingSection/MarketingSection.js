'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaSearch, FaStore, FaEnvelope, FaGlobeAmericas, FaPenAlt, FaArrowRight } from 'react-icons/fa';

const MarketingSection = () => {
    const services = [
        {
            title: "Web Development",
            description: "Custom, responsive websites built with React, Next.js, and modern frameworks for optimal performance.",
            icon: <FaCode className="w-5 h-5" />,
            color: "from-purple-500 to-indigo-600",
            link: "/web-development"
        },
        {
            title: "SEO Services",
            description: "Comprehensive SEO strategies to boost your rankings and organic traffic with measurable results.",
            icon: <FaSearch className="w-5 h-5" />,
            color: "from-blue-500 to-cyan-600",
            link: "/seo"
        },
        {
            title: "E-Commerce Shop",
            description: "Beautiful online stores with secure payments, inventory management, and conversion optimization.",
            icon: <FaStore className="w-5 h-5" />,
            color: "from-green-500 to-emerald-600",
            link: "/shop"
        },
        {
            title: "Newsletter Design",
            description: "Engaging email campaigns that convert, with stunning designs and analytics tracking.",
            icon: <FaEnvelope className="w-5 h-5" />,
            color: "from-red-500 to-pink-600",
            link: "/letter"
        },
        {
            title: "Travel Storytelling",
            description: "Captivating travel content with professional photography and immersive storytelling.",
            icon: <FaGlobeAmericas className="w-5 h-5" />,
            color: "from-yellow-500 to-amber-600",
            link: "/mesbahoffwego"
        },
        {
            title: "Content Creation",
            description: "High-quality blog posts, videos, and social media content tailored to your audience.",
            icon: <FaPenAlt className="w-5 h-5" />,
            color: "from-indigo-500 to-violet-600",
            link: "/content-creation"
        }
    ];

    return (
        <section className="bg-gray-900 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Animated background elements */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.15 }}
                transition={{ duration: 1 }}
                className="fixed inset-0 -z-10 pointer-events-none"
            >
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: 20 + i * 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className={`absolute w-64 h-64 rounded-full blur-xl opacity-70 bg-gradient-to-r ${['from-purple-500', 'from-blue-500', 'from-green-500', 'from-red-500', 'from-yellow-500', 'from-indigo-500'][i % 6]
                            } ${['to-pink-500', 'to-cyan-500', 'to-emerald-500', 'to-orange-500', 'to-amber-500', 'to-violet-500'][i % 6]}`}
                        style={{
                            left: `${10 + (i * 15)}%`,
                            top: `${5 + (i * 10)}%`
                        }}
                    />
                ))}
            </motion.div>

            <div className="max-w-7xl mx-auto relative">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.8, type: 'spring' }
                    }}
                    viewport={{ once: true, margin: '-50px' }}
                    className="text-center mb-12 sm:mb-16 lg:mb-20"
                >
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            transition: { delay: 0.2 }
                        }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                    >
                        Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 animate-gradient-x">Digital Presence</span>
                    </motion.h2>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{
                            scaleX: 1,
                            transition: { delay: 0.4, duration: 0.8, type: 'spring' }
                        }}
                        className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mb-6 rounded-full"
                    />

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: 0.6, duration: 0.6 }
                        }}
                        className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
                    >
                        Comprehensive solutions tailored to elevate your brand across all digital platforms
                    </motion.p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: {
                                    delay: index * 0.1,
                                    duration: 0.6,
                                    type: 'spring'
                                }
                            }}
                            whileHover={{
                                y: -10,
                                transition: { duration: 0.3 }
                            }}
                            viewport={{ once: true, margin: '-50px' }}
                            className="flex flex-col h-full"
                        >
                            <div className="flex-1 bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group relative">
                                {/* Floating gradient dot */}
                                <motion.div
                                    animate={{
                                        y: [0, 15, 0],
                                        opacity: [0.8, 1, 0.8]
                                    }}
                                    transition={{
                                        duration: 3 + index,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className={`absolute -top-2 -right-2 w-16 h-16 rounded-full bg-gradient-to-br ${service.color} opacity-80 blur-lg -z-10`}
                                />

                                {/* Gradient Header */}
                                <div className={`bg-gradient-to-r ${service.color} h-2 w-full`}></div>

                                {/* Service Content */}
                                <div className="p-6 sm:p-7 lg:p-8 flex flex-col flex-1">
                                    <motion.div
                                        whileHover={{
                                            rotate: [0, 15, -15, 0],
                                            scale: [1, 1.1, 1.1, 1],
                                            transition: { duration: 0.6 }
                                        }}
                                        className={`mb-4 sm:mb-5 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${service.color} text-white shadow-lg`}
                                    >
                                        {service.icon}
                                    </motion.div>

                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-300 text-sm sm:text-base mb-6 flex-1">
                                        {service.description}
                                    </p>

                                    {/* Enhanced Button */}
                                    <div className="mt-auto pt-2">
                                        <motion.a
                                            href={service.link}
                                            whileHover={{
                                                scale: 1.03,
                                                transition: { duration: 0.3 }
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`
                        relative inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 overflow-hidden 
                        text-white rounded-lg group border border-gray-600
                        hover:border-transparent transition-all duration-300
                        text-sm sm:text-base
                      `}
                                        >
                                            <span className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-90`}></span>
                                            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                            <span className="relative z-10 flex items-center font-medium">
                                                Explore Service
                                                <FaArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </motion.a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Enhanced CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.4, duration: 0.8 }
                    }}
                    viewport={{ once: true, margin: '-50px' }}
                    className="mt-16 sm:mt-20 text-center"
                >
                    <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            transition: { delay: 0.6 }
                        }}
                        className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6"
                    >
                        Ready to Begin Your Digital Journey?
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{
                            opacity: 1,
                            transition: { delay: 0.8 }
                        }}
                        className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto"
                    >
                        Let's collaborate to create something extraordinary for your business
                    </motion.p>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-block"
                    >
                        <motion.a
                            href="/contact"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: 1, duration: 0.6 }
                            }}
                            className={`
                relative inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 overflow-hidden 
                text-white rounded-lg group bg-gradient-to-r from-purple-600 to-blue-600
                shadow-lg hover:shadow-xl transition-all duration-300
                text-base sm:text-lg
              `}
                        >
                            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                            <span className="relative z-10 flex items-center font-semibold">
                                Get Started Today
                                <FaArrowRight className="ml-3 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-2" />
                            </span>
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default MarketingSection;