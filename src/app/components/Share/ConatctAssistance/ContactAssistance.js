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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple form validation
        if (!formData.name || !formData.email || !formData.phone || !formData.comment) {
            toast.error("Please fill out all required fields.");
            return;
        }

        // Show success toast notification
        toast.success("Your message has been sent successfully!");

        // Handle form submission logic here
        console.log('Form Data:', formData);
        // You can send formData to your backend or API for further processing

        // Optionally, reset form
        setFormData({
            comment: '',
            name: '',
            email: '',
            phone: ''
        });
    };

    return (
        <div className='bg-gray-900 border-t border-t-gray-800'>
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
                    {/* Submit Button */}

                    <div className="py-5">
                        <div className="grid gap-8 justify-center items-center ">
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

                {/* ToastContainer to show the toast notifications */}
                <ToastContainer />
            </div>
        </div>
    );
};

export default ContactAssistance;
