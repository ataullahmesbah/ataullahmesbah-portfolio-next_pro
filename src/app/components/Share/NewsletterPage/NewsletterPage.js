// src/app/newsletter/page.js

'use client'
import React from 'react';
import Link from 'next/link';
import { FaTwitter, FaFacebook, FaLinkedin, FaLightbulb, FaFolder, FaGift } from 'react-icons/fa';

const NewsletterPage = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const name = e.target.name.value;

        // API call to save email (backend e save korar jonno)
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name }),
            });
            const data = await res.json();
            if (res.ok) {
                alert('Successfully subscribed!');
                e.target.reset();
            } else {
                alert(data.error || 'Failed to subscribe. Please try again.');
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    };

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
                    {/* Sign-Up Form */}
                    <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-300 mb-2">
                                    Your Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Your name"
                                    className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                            >
                                Subscribe Now
                            </button>
                            <p className="text-gray-400 text-sm text-center">
                                We respect your privacy. Your email will not be shared.
                            </p>
                        </form>
                    </div>

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