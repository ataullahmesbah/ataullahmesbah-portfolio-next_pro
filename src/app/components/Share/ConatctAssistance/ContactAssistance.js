'use client';

import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactAssistance = () => {
    const [formData, setFormData] = useState({
        comment: '',
        name: '',
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
        if (!formData.name || !formData.email || !formData.phone || !formData.comment) {
            toast.error("Please fill out all required fields.");
            return;
        }

        setIsSubmitting(true);
        toast.info("Submitting your assistance request...", { autoClose: false });

        try {
            const response = await fetch('/api/contact/contact-assistance', {
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
                    "Your message has been sent successfully!",
                    "Thanks for reaching out for assistance.",
                ];

                successMessages.forEach((message, index) => {
                    setTimeout(() => {
                        toast.success(message);
                    }, index * 1000);
                });

                // Reset form fields
                setFormData({
                    comment: '',
                    name: '',
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
        <div className='bg-gray-900 border-t border-t-gray-800 border-b border-gray-800'>
            <div className="max-w-5xl mx-auto px-4 py-12 ">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='text-3xl text-center font-bold text-gray-200'>Need assistance? We’re here for you!</div>
                    <p className='text-center text-gray-300'>Should you require further information or need assistance with the services we offer, feel free to get in touch with us by filling out the form attached below!</p>
                    <div className='flex flex-col gap-4 md:flex-row md:gap-6'>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name*"
                            required
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
                        />
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address*"
                            required
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
                        />
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone No.*"
                            required
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
                        />
                    </div>
                    <textarea
                        name="comment"
                        id="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        placeholder="To help us understand better, enter a brief description about your project."
                        required
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
                    />
                    <div className="py-5">
                        <div className="grid gap-8 justify-center items-center">
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
                <ToastContainer />
            </div>
        </div>
    );
};

export default ContactAssistance;