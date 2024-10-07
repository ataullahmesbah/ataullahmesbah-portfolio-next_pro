'use client';

import { useState } from 'react';

const AffiliateSection = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add submission logic here
        console.log(formData);
    };

    return (
        <section className="py-10 bg-gray-900 text-white">
            {/* Introduction Section */}
            <div className="text-center mb-8 max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-4">Join Our Affiliate Program</h2>
                <p className="text-gray-400">
                    Earn money by referring clients to our services. Its simple, easy, and rewarding.
                    Share your unique link and get a commission on each sale!
                </p>
            </div>

            {/* Registration Form */}
            <div className="bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto p-8">
                <h3 className="text-2xl font-semibold mb-6">Become an Affiliate</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                placeholder="Full Name*"
                                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Email Address*"
                                className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200"
                    >
                        Register Now
                    </button>
                </form>
            </div>

            {/* Tools and Resources */}
            <div className="mt-12 max-w-4xl mx-auto text-center">
                <h3 className="text-2xl font-semibold mb-4">Promotional Tools</h3>
                <p className="text-gray-400 mb-8">
                    Use our professionally designed banners and promotional materials to promote our services.
                </p>
                {/* Example Banners */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-lg font-semibold">Banner 1</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-lg font-semibold">Banner 2</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-lg font-semibold">Banner 3</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AffiliateSection;
