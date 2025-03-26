// src/app/contact/page.js

"use client";

import React, { useState, useEffect } from 'react';
import ContactForm from '@/app/components/ContactForm/ContactForm';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaMedium, FaEnvelope, FaPhone, FaEdge } from 'react-icons/fa';

export const metadata = {
    title: 'Contact | Ataullah Mesbah',
    description: "Connect with Ataullah Mesbah, an SEO expert and experienced traveler. Book a call to learn more about SEO and digital marketing strategies."
};

const ContactPage = () => {
    const [loading, setLoading] = useState(true);

    // Simulate loading for 2 seconds (for demo purposes)
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // 2 seconds delay
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen border-b border-b-gray-700"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}
        >
            {/* Banner Section */}
            <div className="py-16 border-b border-b-gray-700">
                <div className="max-w-7xl mx-auto rounded-lg p-6 lg:p-12 space-y-6 poppins-regular">
                    {/* Breadcrumb Links */}
                    <div className="mb-4 flex justify-center space-x-4 text-white">
                        <Link href="/" className="hover:underline">
                            Home
                        </Link>
                        <span>||</span>
                        <Link href="/contact" className="hover:underline">
                            Contact
                        </Link>
                    </div>

                    {/* Title and Description */}
                    <div className="text-center mb-6 lg:mb-0 text-white space-y-6">
                        <h2 className="text-3xl lg:text-5xl font-normal tracking-tight text-shadow-md">
                            Let’s Start a Conversation
                        </h2>
                        <p className="mt-4 text-lg lg:text-xl text-gray-100">
                            Have any questions or want to connect? Feel free to reach out. I’m here to help!
                        </p>
                    </div>
                </div>
            </div>

            <div className="">
                <ContactForm />
            </div>
            <section className="max-w-6xl mx-auto p-6 lg:p-12">
                {/* Contact Information Section */}
                <div className="mt-12 space-y-8">
                    <div className="text-center">
                        <p className="mt-2 text-gray-200 text-xl">
                            Connect with me via email, phone, or follow me on social media.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-stretch space-y-8 lg:space-y-0 lg:space-x-12">
                        {/* Email */}
                        <div className="flex flex-col justify-center items-center text-center p-6 bg-purple-500/10 border-2 border-purple-500/20 rounded-xl backdrop-blur-md shadow-md hover:shadow-xl hover:scale-105 transition-all duration-500 w-full lg:w-1/3 min-h-[200px] text-white">
                            <FaEnvelope className="text-5xl text-purple-400" />
                            <h4 className="text-2xl font-normal mt-4 text-gray-100">Email</h4>
                            <p className="mt-2 text-lg text-gray-300">info@ataullahmesbah.com</p>
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col justify-center items-center text-center p-6 bg-blue-500/10 border-2 border-blue-500/20 rounded-xl backdrop-blur-md shadow-md hover:shadow-xl hover:scale-105 transition-all duration-500 w-full lg:w-1/3 min-h-[200px] text-white">
                            <FaPhone className="text-5xl text-blue-400" />
                            <h4 className="text-2xl font-normal mt-4 text-gray-100">Phone</h4>
                            <p className="mt-2 text-lg text-gray-300">+8809638844036</p>
                        </div>

                        {/* Social Media */}
                        <div className="flex flex-col justify-center items-center text-center p-6 bg-green-500/10 border-2 border-green-500/20 rounded-xl backdrop-blur-md shadow-md hover:shadow-xl hover:scale-105 transition-all duration-500 w-full lg:w-1/3 min-h-[200px] text-white">
                            <FaEdge className="text-5xl text-green-400" />
                            <h4 className="text-2xl font-normal mt-4 text-gray-100">Follow Me</h4>
                            <div className="flex space-x-6 mt-4">
                                <a href="https://www.facebook.com/ataullahmesbah10" target="_blank" rel="noopener noreferrer">
                                    <FaFacebook className="text-2xl text-gray-400 hover:text-gray-300 transition-colors duration-300" />
                                </a>
                                <a href="https://x.com/ataullah_mesbah" target="_blank" rel="noopener noreferrer">
                                    <FaTwitter className="text-2xl text-gray-400 hover:text-gray-300 transition-colors duration-300" />
                                </a>
                                <a href="https://www.linkedin.com/in/ataullah-mesbah/" target="_blank" rel="noopener noreferrer">
                                    <FaLinkedin className="text-2xl text-gray-400 hover:text-gray-300 transition-colors duration-300" />
                                </a>
                                <a href="https://medium.com/@ataullahmesbah" target="_blank" rel="noopener noreferrer">
                                    <FaMedium className="text-2xl text-gray-400 hover:text-gray-300 transition-colors duration-300" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;