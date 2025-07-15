'use client';

import React from 'react';
import ContactForm from '@/app/components/ContactForm/ContactForm';
import { FaFacebook, FaTwitter, FaLinkedin, FaMedium, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import LocationMap from '../LocationMap/LocationMap';

const ContactPage = () => {
    const contactItems = [
        {
            icon: <FaEnvelope className="text-2xl" />,
            title: "Email",
            content: "info@ataullahmesbah.com",
            color: "purple",
            link: "mailto:info@ataullahmesbah.com"
        },
        {
            icon: <FaPhone className="text-2xl" />,
            title: "Phone",
            content: "+353 87 123 4567",
            color: "blue",
            link: "tel:+353871234567"
        },
        {
            icon: <FaMapMarkerAlt className="text-2xl" />,
            title: "Location",
            content: "Dhaka, Bangladesh",
            color: "green",
            link: "https://maps.google.com/?q=Dhaka,Bangladesh"
        }
    ];

    const socialMedia = [
        { icon: <FaFacebook />, url: "https://www.facebook.com/ataullahmesbah10", name: "Facebook" },
        { icon: <FaTwitter />, url: "https://x.com/ataullah_mesbah", name: "Twitter" },
        { icon: <FaLinkedin />, url: "https://www.linkedin.com/in/ataullah-mesbah/", name: "LinkedIn" },
        { icon: <FaMedium />, url: "https://medium.com/@ataullahmesbah", name: "Medium" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative py-16 md:py-20 overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/images/contact-bg-pattern.svg')] bg-cover opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 h-full flex flex-col justify-center">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-3"
                        >
                            Let’s Work Together
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
                        >
                            Get in touch to discuss your next project or collaboration
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Contact Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl flex flex-col"
                    >
                        <div className="mb-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                Book A Meeting Today!
                            </h2>
                            <p className="text-gray-400 mt-2">
                                Fill out the form and I’ll get back to you within 24 hours
                            </p>
                        </div>
                        <div className="flex-grow flex flex-col">
                            <ContactForm />
                        </div>
                    </motion.div>

                    {/* Contact Info Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="space-y-6 md:space-y-8 h-full"
                    >
                        {/* Contact Methods - Responsive Fixed Version */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700 shadow-xl">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">Contact Details</h3>
                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                {contactItems.map((item, index) => (
                                    <motion.a
                                        key={index}
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ x: 5 }}
                                        className={`flex items-center p-3 sm:p-4 rounded-lg transition-all duration-300 ${item.color === 'purple' ? 'hover:bg-purple-900/20' : item.color === 'blue' ? 'hover:bg-blue-900/20' : 'hover:bg-green-900/20'}`}
                                    >
                                        <div className={`p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 ${item.color === 'purple' ? 'bg-purple-500/10 text-purple-400' : item.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                                            {React.cloneElement(item.icon, { className: "text-xl sm:text-2xl" })}
                                        </div>
                                        <div className="min-w-0"> {/* Prevents text overflow */}
                                            <h4 className="text-base sm:text-lg font-semibold text-white truncate">{item.title}</h4>
                                            <p className="text-sm sm:text-base text-gray-300 truncate">{item.content}</p>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {/* Social Media - Updated with Square Buttons */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Find Me Online</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {socialMedia.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -3 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all"
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white mr-3">
                                            {social.icon}
                                        </div>
                                        <span className="text-gray-300 hover:text-white">{social.name}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Location Map - Professional Style */}

                <LocationMap />
            </div>
        </div>
    );
};

export default ContactPage;