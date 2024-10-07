'use client';

import Image from 'next/image';
import contact from '../../../../public/images/contact.png';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const [errors, setErrors] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const { firstName, lastName, email, phone, message } = formData;
        if (!firstName || !lastName || !email || !phone || !message) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true); // Start loading
            toast.info('Submitting...');

            // Simulate form submission (e.g., API call)
            setTimeout(() => {
                toast.success('Meeting booked successfully!');
                setLoading(false); // Stop loading after success
                setErrors(false);

                // Clear form fields
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            }, 2000); // Simulate delay for form submission
        } else {
            toast.error('Please fill all fields before submitting.');
            setErrors(true);
        }
    };

    return (
        <main className=" py-10">
            <ToastContainer /> {/* React Toastify container */}

            {/* Contact Information Section */}
            <div className="max-w-2xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-100">Book A Meeting Today!</h2>
                <p className="text-gray-200 mt-2">We’re here to help! Feel free to reach out to us anytime.</p>
                <hr className=" my-6 border-gray-300 w-1/2 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto items-center gap-8 px-4 py-6">
                {/* Contact Form Section */}
                <div className="w-full md:px-4 py-12 poppins-regular">
                    <div className=" p-8 ">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        placeholder="First Name*"
                                        className={`mt-1 p-3 w-full bg-gray-200 border ${errors && !formData.firstName ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Last Name*"
                                        className={`mt-1 p-3 w-full bg-gray-200 border ${errors && !formData.lastName ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Email*"
                                        className={`mt-1 p-3 w-full bg-gray-200 border ${errors && !formData.email ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="Phone No*"
                                        className={`mt-1 p-3 w-full bg-gray-200 border ${errors && !formData.phone ? 'border-red-500' : 'border-gray-300'
                                            } rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
                                    />
                                </div>
                            </div>
                            <div>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Message*"
                                    className={`mt-1 p-3 w-full bg-gray-200 border ${errors && !formData.message ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
                                ></textarea>
                            </div>

                            <div className="pt-2">
                                <div className="grid gap-8 justify-start items-start ">
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                                        <button
                                            type="submit"
                                            disabled={loading} // Disable button when loading
                                            className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center"
                                        >
                                            <p className="text-indigo-400 group-hover:text-gray-100 transition duration-200">
                                                {loading ? 'Submitting...' : 'Submit'}
                                            </p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Contact Image */}
                <div className="w-full flex justify-center md:justify-end ">
                    <Image
                        src={contact}
                        alt="ataullahmesbah contact page"
                        width={500}
                        height={500}
                        className="rounded-lg object-contain "
                    />
                </div>
            </div>
        </main>
    );
};

export default ContactForm;
