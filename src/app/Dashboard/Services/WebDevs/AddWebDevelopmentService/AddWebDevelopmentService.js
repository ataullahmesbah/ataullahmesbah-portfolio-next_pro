'use client';

import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const AddWebDevelopmentService = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: '',
    services: [{ name: '', description: '' }],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [name]: value };
    setFormData({ ...formData, services: newServices });
  };

  const addService = () => {
    setFormData({ ...formData, services: [...formData.services, { name: '', description: '' }] });
  };

  const removeService = (index) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index);
      setFormData({ ...formData, services: newServices });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('category', formData.category);
    form.append('services', JSON.stringify(formData.services));

    try {
      const res = await fetch('/api/services/web-development', {
        method: 'POST',
        body: form,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to create service');
      toast.success('Service created successfully');
      router.push('/admin-dashboard/services/web-devs/all');
    } catch (error) {
      toast.error(`Failed to create service: ${error.message}`);
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
          Add Web Development Service
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-200 mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Custom Website Services"
                required
                className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-200 mb-2">Services</label>
              {formData.services.map((service, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-700 rounded-lg">
                  <input
                    type="text"
                    name="name"
                    value={service.name}
                    onChange={(e) => handleServiceChange(index, e)}
                    placeholder="e.g., Node.js Development"
                    required
                    className="w-full p-3 mb-2 bg-gray-600 text-gray-200 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    name="description"
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, e)}
                    placeholder="Describe the service"
                    required
                    className="w-full p-3 bg-gray-600 text-gray-200 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {formData.services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-red-400 hover:text-red-600 mt-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                className="text-indigo-400 hover:text-indigo-600 text-sm"
              >
                Add Service
              </button>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create Service
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddWebDevelopmentService;