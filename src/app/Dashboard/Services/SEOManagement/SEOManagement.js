'use client';

import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const SEOManagement = () => {
    const [formData, setFormData] = useState({
        category: '',
        serviceInputs: [{ name: '', description: '', image: null }],
    });

    // Handle form input changes
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        if (name === 'category') {
            setFormData({ ...formData, category: value });
        } else {
            const newServiceInputs = [...formData.serviceInputs];
            newServiceInputs[index] = { ...newServiceInputs[index], [name]: value };
            setFormData({ ...formData, serviceInputs: newServiceInputs });
        }
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const newServiceInputs = [...formData.serviceInputs];
            newServiceInputs[index].image = file;
            setFormData({ ...formData, serviceInputs: newServiceInputs });
        }
    };

    // Add or remove service input fields
    const addServiceInput = () => {
        setFormData({
            ...formData,
            serviceInputs: [...formData.serviceInputs, { name: '', description: '', image: null }],
        });
    };

    const removeServiceInput = (index) => {
        if (formData.serviceInputs.length > 1) {
            const newServiceInputs = formData.serviceInputs.filter((_, i) => i !== index);
            setFormData({ ...formData, serviceInputs: newServiceInputs });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('category', formData.category);
        form.append('services', JSON.stringify(formData.serviceInputs.map(({ name, description }) => ({ name, description }))));
        formData.serviceInputs.forEach((service) => {
            if (service.image) form.append('images', service.image);
        });

        try {
            const res = await fetch('/api/services/seo', {
                method: 'POST',
                body: form,
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to save service');
            toast.success('Service created successfully');
            setFormData({ category: '', serviceInputs: [{ name: '', description: '', image: null }] });
        } catch (error) {
            toast.error(`Failed to save service: ${error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-12">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-white mb-8 text-center"
                >
                    Add SEO Services
                </motion.h1>

                {/* Add Service Form */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg"
                >
                    <h2 className="text-2xl font-semibold text-gray-100 mb-6">Add New Service</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-200 mb-2">Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={(e) => handleInputChange(e)}
                                placeholder="e.g., On-Page SEO"
                                required
                                className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        {formData.serviceInputs.map((service, index) => (
                            <div key={index} className="space-y-4 border-b border-gray-700 pb-4">
                                <div>
                                    <label className="block text-gray-200 mb-2">Service Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={service.name}
                                        onChange={(e) => handleInputChange(e, index)}
                                        placeholder="e.g., Keyword Research"
                                        required
                                        className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-200 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={service.description}
                                        onChange={(e) => handleInputChange(e, index)}
                                        placeholder="Describe the service"
                                        required
                                        className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-200 mb-2">Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, index)}
                                        required
                                        className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg"
                                    />
                                </div>
                                {formData.serviceInputs.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeServiceInput(index)}
                                        className="text-red-400 hover:text-red-600 text-sm"
                                    >
                                        Remove Service
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={addServiceInput}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Add Another Service
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Add Service
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default SEOManagement;