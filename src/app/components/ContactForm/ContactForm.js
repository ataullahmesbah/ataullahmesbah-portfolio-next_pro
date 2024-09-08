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
            return false; // Validation fails
        }
        return true; // Validation passes
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form validation
        if (validateForm()) {
            // Handle form submission logic here
            toast.success('Meeting booked successfully!');
            console.log(formData);
            setErrors(false);
        } else {
            toast.error('Please fill all fields before submitting.');
            setErrors(true);
        }
    };

    return (
        <main className="bg-sky-50 py-10">
            <ToastContainer /> {/* React Toastify container */}

            {/* Contact Information Section */}
            <div className="max-w-2xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800">Book A Meeting Today!</h2>
                <p className="text-gray-600 mt-2">We’re here to help! Feel free to reach out to us anytime.</p>
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
                                        placeholder='First Name*'
                                        className={`mt-1 p-3 w-full border ${errors && !formData.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
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
                                        placeholder='First Name*'
                                        className={`mt-1 p-3 w-full border ${errors && !formData.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
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
                                        placeholder='Email*'
                                        className={`mt-1 p-3 w-full border ${errors && !formData.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
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
                                        placeholder='Phone No*'
                                        className={`mt-1 p-3 w-full border ${errors && !formData.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
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
                                    placeholder='Message*'
                                    className={`mt-1 p-3 w-full border ${errors && !formData.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring focus:ring-blue-200`}
                                ></textarea>
                            </div>
                            <div className="">
                                <button
                                    type="submit"
                                    className="bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-900 transition duration-200"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Contact Image */}
                <div className="w-full flex justify-center md:justify-end">
                    <Image
                        src={contact}
                        alt="ataullahmesbah contact page"
                        width={500}
                        height={500}
                        className="rounded-lg object-contain"
                    />
                </div>
            </div>




        </main>
    );
};

export default ContactForm;
