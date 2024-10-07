'use client'

import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast'; // Import react-hot-toast

const SEOAuditForm = () => {
    const [formData, setFormData] = useState({
        websiteName: '',
        email: '',
        phone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Show success toast when form is submitted
        toast.success('Your SEO audit request has been submitted!');

        // Log form data (you can send formData to your backend or API here)
        console.log('Form Data:', formData);

        // Optionally, reset the form after submission
        setFormData({
            websiteName: '',
            email: '',
            phone: ''
        });
    };

    return (
        <div>
            {/* Toaster for displaying toast notifications */}
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
                    <div className="grid gap-8 justify-start items-start ">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                            <button
                                type="submit"
                                className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center">
                                <p className="text-indigo-400 group-hover:text-gray-100 transition duration-200">
                                    Get Audit
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
