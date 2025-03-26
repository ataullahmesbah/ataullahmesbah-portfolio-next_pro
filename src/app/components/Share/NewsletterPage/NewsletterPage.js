// src/app/newsletter/page.js
import React from 'react';
import Link from 'next/link';

import { FaTwitter, FaFacebook, FaLinkedin, FaLightbulb, FaFolder, FaGift } from 'react-icons/fa';
import NewsletterForm from '../NewsletterForm/NewsletterForm';

const NewsletterPage = () => {
    return (
        <div className="bg-gray-900 min-h-screen py-10">
            {/* Header */}
            <header className="text-center mb-12">
                <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="inline-block mb-6">
                        <h1 className="text-3xl font-bold text-white">Ataullah Mesbah</h1>
                    </Link>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Join My Newsletter!
                    </h1>
                    <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
                        Get the latest updates on my projects, tech tips, and exclusive offers directly in your inbox.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sign-Up Form (Client Component) */}
                    <NewsletterForm />

                    {/* Benefits Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Why Subscribe?</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <FaLightbulb className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-300">Weekly tech tips to boost your skills.</span>
                            </li>
                            <li className="flex items-start">
                                <FaFolder className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-300">Latest updates on my projects.</span>
                            </li>
                            <li className="flex items-start">
                                <FaGift className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0" />
                                <span className="text-gray-300">Exclusive offers just for subscribers.</span>
                            </li>
                        </ul>
                        <p className="text-blue-400 hover:underline">
                            Don’t miss out – join now!
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 text-center">
                <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center space-x-6 mb-4">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-500 transition-colors">
                            <FaTwitter className="w-6 h-6" />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-500 transition-colors">
                            <FaFacebook className="w-6 h-6" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-500 transition-colors">
                            <FaLinkedin className="w-6 h-6" />
                        </a>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                        You can unsubscribe anytime.
                    </p>
                    <Link href="/contact" className="text-blue-400 hover:underline">
                        Contact Me
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default NewsletterPage;