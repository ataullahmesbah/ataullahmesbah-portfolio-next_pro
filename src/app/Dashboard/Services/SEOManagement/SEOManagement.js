'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

const SEOManagement = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        category: '',
        serviceInputs: [{ name: '', description: '', image: null }],
    });
    const [editingId, setEditingId] = useState(null);

    // Fetch services
    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services/seo');
            if (!res.ok) throw new Error('Failed to fetch services');
            const data = await res.json();
            setServices(data);
        } catch (error) {
            toast.error('Failed to load services');
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

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
                method: editingId ? 'PUT' : 'POST',
                body: form,
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to save service');
            toast.success(editingId ? 'Service updated successfully' : 'Service created successfully');
            setFormData({ category: '', serviceInputs: [{ name: '', description: '', image: null }] });
            setEditingId(null);
            fetchServices();
        } catch (error) {
            toast.error(`Failed to save service: ${error.message}`);
        }
    };

    // Edit service
    const handleEdit = (service) => {
        setFormData({
            category: service.category,
            serviceInputs: service.services.map(s => ({ name: s.name, description: s.description, image: null })),
        });
        setEditingId(service._id);
    };

    // Delete service
    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/services/seo/${id}`, {
                method: 'DELETE',
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || 'Failed to delete service');
            toast.success('Service deleted successfully');
            fetchServices();
        } catch (error) {
            toast.error(`Failed to delete service: ${error.message}`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <Toaster position="top-center" reverseOrder={false} />
            <h1 className="text-3xl font-bold text-gray-100 mb-8">Manage SEO Services</h1>

            {/* Add/Edit Form */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg">
                <div>
                    <label className="block text-gray-200 mb-2">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="e.g., On-Page SEO"
                        required
                        className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                                className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                                className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-200 mb-2">Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, index)}
                                required={!editingId}
                                className="p-3 w-full border border-gray-300 rounded-lg"
                            />
                        </div>
                        {formData.serviceInputs.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeServiceInput(index)}
                                className="text-red-400 hover:text-red-600"
                            >
                                Remove Service
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addServiceInput}
                    className="text-indigo-400 hover:text-indigo-600"
                >
                    Add Another Service
                </button>
                <button
                    type="submit"
                    className="px-7 py-4 bg-black text-indigo-400 rounded-lg hover:text-gray-100"
                >
                    {editingId ? 'Update Service' : 'Add Service'}
                </button>
            </form>

            {/* Service List */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Existing Services</h2>
                {services.length === 0 ? (
                    <p className="text-gray-200">No services found.</p>
                ) : (
                    services.map((service) => (
                        <div key={service._id} className="bg-gray-800 p-4 rounded-lg mb-4">
                            <h3 className="text-xl font-semibold text-gray-100">{service.category}</h3>
                            <ul className="list-disc pl-5 text-gray-200">
                                {service.services.map((s) => (
                                    <li key={s._id}>{s.name}: {s.description}</li>
                                ))}
                            </ul>
                            <div className="mt-2">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="text-indigo-400 hover:text-indigo-600 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service._id)}
                                    className="text-red-400 hover:text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SEOManagement;