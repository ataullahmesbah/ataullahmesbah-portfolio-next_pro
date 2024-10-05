import React from 'react';

const NewSection = () => {
    return (
        <div className="bg-black text-white py-16">
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20">


                <div className="text-left space-y-6 lg:w-1/2">
                    <h2 className="text-5xl font-bold">What We Are Building</h2>
                    <div className="flex space-x-12 mt-8">
                        <div>
                            <h3 className="text-4xl font-bold">78+</h3>
                            <p className="text-lg text-gray-400">Countries</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold">250+</h3>
                            <p className="text-lg text-gray-400">Employees</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold">347k+</h3>
                            <p className="text-lg text-gray-400">Clients</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-bold">5+</h3>
                            <p className="text-lg text-gray-400">Offices</p>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 lg:mt-0 lg:w-1/2">


                    <div className="relative bg-gray-800 rounded-lg overflow-hidden p-6 border border-purple-700 hover:border-indigo-600 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-black opacity-75"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">Finalytics</h3>
                            <p className="text-gray-300 mb-6">
                                We’re a transformative software consultancy, SaaS, Marketing, and global BPO support, crafting innovative solutions worldwide.
                            </p>
                            <button className="text-white border border-white rounded px-4 py-2">View More</button>
                        </div>
                    </div>


                    <div className="relative bg-gray-800 rounded-lg overflow-hidden p-6 border border-purple-700 hover:border-indigo-600 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-black opacity-75"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">GrowthNext</h3>
                            <p className="text-gray-300 mb-6">
                                We empower financial growth through innovative technology, offering solutions for Metatrader, Fix API, Liquidity, Prop Firms, and Brokerages.
                            </p>
                            <button className="text-white border border-white rounded px-4 py-2">View More</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
};

export default NewSection;