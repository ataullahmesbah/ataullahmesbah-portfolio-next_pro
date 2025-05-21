'use client'

import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const DevelopmentForm = () => {
    const [formData, setFormData] = useState({
        comment: '',
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
        if (!formData.email || !formData.phone || !formData.comment) {
            toast.error("Please fill out all required fields.");
            return;
        }

        setIsSubmitting(true);
        toast.loading("Submitting your request...");

        try {
            const response = await fetch('/api/contact/web-form', {
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
                    "Thanks for booking Web Development Services.",
                    "Your request has been successfully submitted.",
                ];

                successMessages.forEach((message, index) => {
                    setTimeout(() => {
                        toast.success(message);
                    }, index * 1000);
                });

                // Reset form fields
                setFormData({
                    email: '',
                    phone: '',
                    comment: ''
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

            <form onSubmit={handleSubmit} className="space-y-4 w-full px-4">
                <div>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>
                <div>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                        className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>
                <div>
                    <textarea
                        name="comment"
                        id="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="Describe your needs"
                        required
                        className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DevelopmentForm;