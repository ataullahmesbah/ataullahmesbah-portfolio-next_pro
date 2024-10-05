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
            <div className="pt-2">
                <div className="grid gap-8 justify-start items-start ">
                    <div className="relative group">

                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>


                        <button
                            type="submit"
                            className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center">

                            <p href='/contact' className=" text-indigo-400 group-hover:text-gray-100 transition duration-200">Submit</p>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default DevelopmentForm;
