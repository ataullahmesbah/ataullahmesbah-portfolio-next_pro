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
        <div className="max-w-5xl mx-auto px-4 py-12">
            <form onSubmit={handleSubmit} className="space-y-4">

                <div className='text-3xl text-center font-bold'>Need assistance? We’re here for you!</div>

                <p className='text-center'>Should you require further information or need assistance with the services we offer, feel free to get in touch with us by filling out the form attached below!</p>

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

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-sky-800 hover:bg-sky-700 px-8 py-3 text-white rounded-md transition-colors md:w-auto w-full"
                    >
                        Submit
                    </button>
                </div>
            </form>

            {/* ToastContainer to show the toast notifications */}
            <ToastContainer />
        </div>
    );
};

export default ContactAssistance;
