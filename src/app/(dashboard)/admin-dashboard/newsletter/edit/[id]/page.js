// src/app/newsletter/edit/[id]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import toast, { Toaster } from 'react-hot-toast';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const EditNewsletterPage = ({ params }) => {
    const [formData, setFormData] = useState({
        id: params.id,
        mainImage: '',
        title: '',
        metaTitle: '',
        metaDescription: '',
        description: '',
        content: '',
        category: '',
        author: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsletter = async () => {
            try {
                const res = await fetch(`/api/newsletter/letter?id=${params.id}`);
                const data = await res.json();
                setFormData({
                    id: params.id,
                    mainImage: data.mainImage,
                    title: data.title,
                    metaTitle: data.metaTitle,
                    metaDescription: data.metaDescription,
                    description: data.description,
                    content: data.content,
                    category: data.category,
                    author: data.author,
                });
            } catch (error) {
                toast.error('Error fetching newsletter');
            } finally {
                setLoading(false);
            }
        };
        fetchNewsletter();
    }, [params.id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleContentChange = (value) => {
        setFormData({ ...formData, content: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/newsletter/letter', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Newsletter updated successfully');
            } else {
                toast.error(data.error || 'Failed to update newsletter');
            }
        } catch (error) {
            toast.error('Error updating newsletter');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6 md:p-10">
            <Toaster position="top-center" />
            <h1 className="text-4xl font-normal tracking-tight text-shadow-md mb-10 text-center">
                Edit Newsletter
            </h1>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                <div>
                    <label className="block text-gray-300 mb-2">Main Image URL</label>
                    <input
                        type="text"
                        name="mainImage"
                        value={formData.mainImage}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter image URL"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter title"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Meta Title</label>
                    <input
                        type="text"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter meta title"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Meta Description</label>
                    <textarea
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter meta description"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter description"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Content</label>
                    <ReactQuill
                        value={formData.content}
                        onChange={handleContentChange}
                        theme="snow"
                        className="bg-gray-800 text-white"
                        modules={{
                            toolbar: [
                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                ['bold', 'italic', 'underline'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['link', 'image'],
                                ['clean'],
                            ],
                        }}
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter category"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Author</label>
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter author name"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-800 rounded-lg hover:from-green-700 hover:to-green-900 transition-all duration-300"
                >
                    Update Newsletter
                </button>
            </form>
        </div>
    );
};

export default EditNewsletterPage;