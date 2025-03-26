// src/app/admin/attachNewsletter/add/page.js

"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import toast, { Toaster } from 'react-hot-toast';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const AttachNewsletterPage = () => {
    const [formData, setFormData] = useState({
        mainImage: '',
        title: '',
        metaTitle: '',
        metaDescription: '',
        description: '',
        content: '',
        category: '',
        author: '',
    });

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
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Newsletter added successfully');
                setFormData({
                    mainImage: '',
                    title: '',
                    metaTitle: '',
                    metaDescription: '',
                    description: '',
                    content: '',
                    category: '',
                    author: '',
                });
            } else {
                toast.error(data.error || 'Failed to add newsletter');
            }
        } catch (error) {
            toast.error('Error adding newsletter');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6 md:p-10">
            <Toaster position="top-center" />
            <h1 className="text-4xl font-normal tracking-tight text-shadow-md mb-10 text-center">
                Add New Newsletter
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
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300"
                >
                    Add Newsletter
                </button>
            </form>
        </div>
    );
};

export default AttachNewsletterPage;