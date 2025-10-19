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
            title: "Phone Numbers",
            content: "+8809638844036",
            additionalContent: "+8801732-183389",
            color: "blue",
            link: "tel:+8809638844036"
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
                className="relative py-12 md:py-20 overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/images/contact-bg-pattern.svg')] bg-cover opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-center">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-3"
                        >
                            Let's Work Together
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4"
                        >
                            Get in touch to discuss your next project or collaboration
                        </motion.p>
                    </div>
                </div>
            </motion.section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                    {/* Contact Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700 shadow-xl flex flex-col order-2 lg:order-1"
                    >
                        <div className="mb-6">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                                Book A Meeting Today!
                            </h2>
                            <p className="text-gray-400 mt-2 text-sm sm:text-base">
                                Fill out the form and I'll get back to you within 24 hours
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
                        className="space-y-6 md:space-y-8 h-full order-1 lg:order-2"
                    >
                        {/* Contact Methods - Improved with Single Phone Entry */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700 shadow-xl">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center md:text-left">
                                Contact Details
                            </h3>
                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                {contactItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ x: 5 }}
                                        className={`flex items-start p-3 sm:p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-opacity-50 ${item.color === 'purple'
                                            ? 'hover:bg-purple-900/20 hover:border-purple-500/30'
                                            : item.color === 'blue'
                                                ? 'hover:bg-blue-900/20 hover:border-blue-500/30'
                                                : 'hover:bg-green-900/20 hover:border-green-500/30'
                                            }`}
                                    >
                                        <div className={`p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0 ${item.color === 'purple'
                                            ? 'bg-purple-500/10 text-purple-400'
                                            : item.color === 'blue'
                                                ? 'bg-blue-500/10 text-blue-400'
                                                : 'bg-green-500/10 text-green-400'
                                            }`}>
                                            {React.cloneElement(item.icon, { className: "text-lg sm:text-xl md:text-2xl" })}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm sm:text-base font-semibold text-white mb-1">
                                                {item.title}
                                            </h4>
                                            {item.title === "Phone Numbers" ? (
                                                <div className="space-y-1">
                                                    <a
                                                        href="tel:+8809638844036"
                                                        className="block text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-200"
                                                    >
                                                        {item.content}
                                                    </a>
                                                    <a
                                                        href="tel:+8801732183389"
                                                        className="block text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-200"
                                                    >
                                                        {item.additionalContent}
                                                    </a>
                                                </div>
                                            ) : (
                                                <a
                                                    href={item.link}
                                                    target={item.title === "Location" ? "_blank" : "_self"}
                                                    rel="noopener noreferrer"
                                                    className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors duration-200"
                                                >
                                                    {item.content}
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media - Improved Responsive */}
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700 shadow-xl">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center md:text-left">
                                Find Me Online
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                {socialMedia.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-gray-700/80 hover:bg-gray-600/90 transition-all duration-300 border border-gray-600 hover:border-purple-500/30 group text-center"
                                    >
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-300 group-hover:text-white mb-2 transition-colors duration-300">
                                            {social.icon}
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white font-medium transition-colors duration-300 truncate w-full">
                                            {social.name}
                                        </span>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Location Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="mt-8 md:mt-12"
                >
                    <LocationMap />
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;