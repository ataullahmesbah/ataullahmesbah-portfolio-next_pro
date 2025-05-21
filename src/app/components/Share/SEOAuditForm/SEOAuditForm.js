'use client'

import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const SEOAuditForm = () => {
    const [formData, setFormData] = useState({
        websiteName: '',
        email: '',
        phone: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.websiteName || !formData.email || !formData.phone) {
            toast.error("Please fill out all required fields.");
            return;
        }

        setIsSubmitting(true);
        toast.loading("Submitting your SEO audit request...");

        try {
            const response = await fetch('/api/contact/seo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                // Show multiple success toasts
                const successMessages = [
                    "Your SEO audit request has been submitted!",
                    "Thanks for choosing our SEO services.",
                ];

                successMessages.forEach((message, index) => {
                    setTimeout(() => {
                        toast.success(message);
                    }, index * 1000);
                });

                // Reset form fields
                setFormData({
                    websiteName: '',
                    email: '',
                    phone: ''
                });
            } else {
                throw new Error(result.error || 'Failed to send request');
            }
        } catch (error) {
            toast.error(`Failed to send request: ${error.message}`);
        } finally {
            setIsSubmitting(false);
            toast.dismiss(); // Dismiss loading toast
        }
    };

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />

            <form onSubmit={handleSubmit} className="space-y-6 text-center px-4">
                <div>
                    <input
                        type="text"
                        name="websiteName"
                        id="websiteName"
                        value={formData.websiteName}
                        onChange={handleChange}
                        placeholder="Website Name"
                        required
                        className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter Email"
                        required
                        className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                        className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>
                <div className="pt-2">
                    <div className="grid gap-8 justify-start items-start">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center"
                            >
                                <p className="text-indigo-400 group-hover:text-gray-100 transition duration-200">
                                    {isSubmitting ? 'Submitting...' : 'Get Audit'}
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SEOAuditForm;