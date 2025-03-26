// src/app/components/NewsletterForm.js
"use client";

import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const NewsletterForm = () => {
    const [isLoading, setIsLoading] = useState(false); // Loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return; // Prevent double submit

        setIsLoading(true); // Show loading
        const email = e.target.email.value;
        const name = e.target.name.value;

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Successfully subscribed!', { duration: 4000 });
                e.target.reset();
            } else {
                toast.error(data.error || 'Failed to subscribe. Please try again.', { duration: 4000 });
            }
        } catch (error) {
            toast.error('An error occurred. Please try again later.', { duration: 4000 });
        } finally {
            setIsLoading(false); // Hide loading
        }
    };

    return (
        <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700">
            <Toaster position="top-right" /> {/* Add Toaster for toast notifications */}
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
                    disabled={isLoading}
                    className={`w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-purple-700'
                        }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                                ></path>
                            </svg>
                            Subscribing...
                        </span>
                    ) : (
                        'Subscribe Now'
                    )}
                </button>
                <p className="text-gray-400 text-sm text-center">
                    We respect your privacy. Your email will not be shared.
                </p>
            </form>
        </div>
    );
};

export default NewsletterForm;