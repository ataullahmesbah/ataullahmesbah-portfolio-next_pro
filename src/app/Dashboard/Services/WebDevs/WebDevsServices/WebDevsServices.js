'use client';

import ContactAssistance from '@/app/components/Share/ConatctAssistance/ContactAssistance';
import DevelopmentForm from '@/app/components/Share/DevelopmentForm/DevelopmentForm';
import WebPackage from '@/app/Dashboard/Services/WebDevs/WebPackage/WebPackage';
import WebService from '@/app/Dashboard/Services/WebDevs/WebService/WebService';
import { motion } from "framer-motion";
import Link from 'next/link';
import { FiArrowRight, FiCode, FiPlay, FiSearch, FiTrendingUp, FiZap } from 'react-icons/fi';

const WebDevsServices = () => {
    return (
        <section className="min-h-screen border-b border-b-gray-800"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}>
            <div className=" ">


                {/* Hero Section */}
               <div className="relative py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/20 overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="text-center">
                            {/* Main Heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                            >
                                Web Development{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                                    Services
                                </span>
                            </motion.h1>

                            {/* Enhanced Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
                            >
                                 In today's digital landscape, your website is your most valuable asset. I specialize in <strong className="text-purple-400">Next.js development</strong> to create high-converting, SEO-friendly websites that load instantly and provide exceptional user experiences across all devices.
                            </motion.p>

                       {/* Services Quick Overview - Simple Elegant */}
<motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    viewport={{ once: true }}
    className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8 max-w-md mx-auto"
>
    <div className="bg-purple-500/20 border border-purple-500/30 rounded-full px-6 py-3 hover:bg-purple-500/30 transition-all duration-300">
        <div className="text-purple-300 text-sm font-semibold text-center">
            Custom Development
        </div>
    </div>
    <div className="bg-pink-500/20 border border-pink-500/30 rounded-full px-6 py-3 hover:bg-pink-500/30 transition-all duration-300">
        <div className="text-pink-300 text-sm font-semibold text-center">
            E-commerce
        </div>
    </div>
    <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-full px-6 py-3 hover:bg-indigo-500/30 transition-all duration-300">
        <div className="text-indigo-300 text-sm font-semibold text-center">
            Performance & SEO
        </div>
    </div>
</motion.div>


                            {/* IMPROVED: Enhanced CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                            >
                                {/* Enhanced Primary Button */}
                                <Link
                                    href="/contact"
                                    className="group relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 overflow-hidden border border-gray-700 hover:border-purple-500/50"
                                >
                                    {/* Animated Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                                    {/* Hover Gradient Overlay */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                                    {/* Base Background */}
                                    <div className="absolute inset-[1px] rounded-xl bg-gray-900 -z-10 group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:via-purple-900 group-hover:to-gray-800 transition-all"></div>

                                    <span className="relative">Start Your Project</span>
                                    <FiArrowRight className="relative group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" />
                                </Link>

                                {/* Enhanced Secondary Button */}
                                <Link
                                    href="/seo"
                                    className="group relative bg-gray-900/50 backdrop-blur-md border border-gray-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 hover:bg-gray-800/70 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden"
                                >
                                    {/* Left Accent Bar */}
                                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-r-full group-hover:from-purple-300 group-hover:to-purple-500 transition-all"></div>

                                    {/* Hover Background Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    <FiPlay className="relative group-hover:scale-110 transition-transform duration-300" />
                                    <span className="relative">Explore SEO Services</span>
                                </Link>
                            </motion.div>



                            {/* Trust Indicators - Smaller and Better */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                viewport={{ once: true }}
                                className="grid grid-cols-3 gap-4 max-w-md mx-auto"
                            >
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400 mb-1">95%+</div>
                                    <div className="text-gray-400 text-xs">Core Web Vitals</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-pink-400 mb-1">50+</div>
                                    <div className="text-gray-400 text-xs">Projects Delivered</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-indigo-400 mb-1">SEO</div>
                                    <div className="text-gray-400 text-xs">Integrated</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 poppins-regular py-10">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center pb-10">
                        {/* Service List */}
                        <div className="space-y-8">
                            {[
                                { title: 'Customized Development', description: 'Tailored solutions that meet your business needs.' },
                                { title: 'Performance Optimization', description: 'Ensuring your site loads fast and runs smoothly.' },
                                { title: 'Maintenance & Support', description: 'Continuous support to keep your site up-to-date.' },
                            ].map((service, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <div className="bg-blue-950 p-3 rounded-full drop-shadow-lg transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-800 duration-1000">
                                        {/* Add an Icon Here */}
                                        <svg className="w-6 h-6 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2a10 10 0 11-10 10A10 10 0 0112 2m0-2a12 12 0 1012 12A12 12 0 0012 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-100">{service.title}</h3>
                                        <p className="text-gray-300">{service.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Development Form */}
                        <DevelopmentForm />
                    </div>

                </div>

                <div>
                    {/* TO DO List */}
                    <WebService />
                </div>


                <div>

                    {/* TO DO List */}
                    <WebPackage />
                </div>

            </div>

            <div>
                {/* TO DO List */}
                <ContactAssistance />
            </div>


        </section>
    );
};

export default WebDevsServices;
