'use client';

import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const AddWebPackage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        features: [''],
        price: '',
        discount: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const removeFeature = (index) => {
        if (formData.features.length > 1) {
            const newFeatures = formData.features.filter((_, i) => i !== index);
            setFormData({ ...formData, features: newFeatures });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', formData.name);
        form.append('description', formData.description);
        form.append('features', JSON.stringify(formData.features));
        form.append('price', formData.price);
        form.append('discount', formData.discount);

        try {
            const res = await fetch('/api/services/web-development/webpack', {
                method: 'POST',
                body: form,
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to create package');
            toast.success('Package created successfully');
            router.push('/admin-dashboard/services/web-devs/webpack/all');
        } catch (error) {
            toast.error(`Failed to create package: ${error.message}`);
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
                    Add Web Package
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-200 mb-2">Package Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Custom Website Package"
                                required
                                className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-200 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the package"
                                required
                                className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-200 mb-2">Features</label>
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        placeholder="e.g., Full Stack Development"
                                        required
                                        className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    {formData.features.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addFeature}
                                className="text-indigo-400 hover:text-indigo-600 text-sm"
                            >
                                Add Feature
                            </button>
                        </div>
                        <div>
                            <label className="block text-gray-200 mb-2">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="e.g., 2300"
                                required
                                min="0"
                                className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-200 mb-2">Discount ($)</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleInputChange}
                                placeholder="e.g., 2199"
                                required
                                min="0"
                                className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Create Package
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AddWebPackage;