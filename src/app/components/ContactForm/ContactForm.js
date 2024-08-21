'use client'

import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
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
        console.log(formData);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Contact Information Section */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800">Contact Us</h2>
                <p className="text-gray-600 mt-2">We're here to help! Feel free to reach out to us anytime.</p>
            </div>

            {/* Contact Form Section */}
            <div className="bg-white p-8 shadow-lg rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-gray-700 font-medium">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-gray-700 font-medium">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-gray-700 font-medium">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-gray-700 font-medium">Message</label>
                        <textarea
                            name="message"
                            id="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        ></textarea>
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
