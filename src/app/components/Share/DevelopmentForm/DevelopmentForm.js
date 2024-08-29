'use client'

import React, { useState } from 'react';

const DevelopmentForm = () => {
    const [formData, setFormData] = useState({
        comment: '',
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
        // Handle form submission logic here
        console.log('Form Data:', formData);
        // You can send formData to your backend or API for further processing
    };

    return (
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
            <div className="text-center">
                <button
                    type="submit"
                    className="bg-sky-800 hover:bg-sky-700 w-full md:w-1/2 p-3 text-white rounded-md transition-colors"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default DevelopmentForm;
