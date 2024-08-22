'use client'

import React, { useState } from 'react';

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
        // Handle form submission logic here
        console.log('Form Data:', formData);
        // You can send formData to your backend or API for further processing
    };

    return (
        <form onSubmit={handleSubmit} className=" space-y-6 text-center  px-4">
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
            <div className='bg-sky-800 hover:bg-sky-700 w-1/2 rounded-md'>
                <button
                    type="submit"
                    className=" text-white p-3 rounded-md   transition-colors"
                >
                    Get Audit
                </button>
            </div>
        </form>
    );
};

export default SEOAuditForm;
