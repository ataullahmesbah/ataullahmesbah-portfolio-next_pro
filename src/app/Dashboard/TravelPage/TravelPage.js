// app/admin-dashboard/travel/add/page.js

"use client";
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function AddTravel() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        location: '',
        category: 'Journey',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [slugPreview, setSlugPreview] = useState('');

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setForm({ ...form, title });
        // Show slug preview to admin
        setSlugPreview(title.toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate title doesn't produce empty slug
        if (!slugPreview) {
            toast.error('Please enter a valid title with alphanumeric characters');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));

        try {
            await axios.post('/api/travel/new', formData);
            toast.success('Travel added/updated successfully');
            setForm({ title: '', description: '', location: '', category: 'Journey', image: null });
            setSlugPreview('');
        } catch (error) {
            toast.error('Error: ' + (error.response?.data?.error || 'Failed to save'));
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => setForm({ ...form, image: e.target.files[0] });

    return (
        <div className="min-h-screen bg-gray-800 p-6">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Add Travel Entry</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-700 p-8 rounded-xl shadow-2xl transform hover:shadow-3xl transition-shadow duration-300">

                <div className="mb-6">
                    <label className="block text-white font-semibold mb-2">Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={handleTitleChange} // Updated handler
                        className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                    {slugPreview && (
                        <p className="text-gray-400 text-sm mt-1">
                            URL Slug: {slugPreview}
                        </p>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block text-white font-semibold mb-2">Description</label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows="4"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-white font-semibold mb-2">Location</label>
                    <input
                        type="text"
                        value={form.location}
                        onChange={e => setForm({ ...form, location: e.target.value })}
                        className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-white font-semibold mb-2">Category</label>
                    <select
                        value={form.category}
                        onChange={e => {
                            setForm({ ...form, category: e.target.value });
                            // Show specific requirements based on category
                        }}
                        className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="Journey">Journey (Hero Section)</option>
                        <option value="Historical">Historical (Fixed Cards)</option>
                        <option value="Gallery">Gallery (Flexible Grid)</option>
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-white font-semibold mb-2">Image Upload</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full p-3 text-white border-2 border-dashed border-gray-600 rounded-lg bg-gray-900/50 hover:border-green-500 transition-colors"
                        accept="image/*"
                        required
                    />
                    <div className="mt-3 p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                        <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Image Requirements for ALL Categories:
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                            <li className="text-yellow-300 font-medium">✓ MUST BE: 1200×628 pixels (2:1 ratio)</li>
                            <li>✓ Landscape orientation required</li>
                            <li>✓ All images will be auto-cropped to 1200×628px</li>
                            <li>✓ Optimal for Open Graph (Facebook/Twitter)</li>
                            <li>✓ Consistent display across all pages</li>
                            <li className="text-gray-400 mt-2">📁 Max size: 10MB | Formats: JPG, PNG, WebP</li>
                            <li className="text-gray-400">⚡ Images will be automatically optimized to WebP</li>
                        </ul>

                        {/* Image Preview with 1200x628 aspect ratio */}
                        {form.image && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <p className="text-gray-400 text-sm mb-2">Preview (2:1 ratio):</p>
                                <div className="relative w-full h-32 bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                                    <img
                                        src={URL.createObjectURL(form.image)}
                                        alt="Preview"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        1200×628
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-3 rounded-lg text-white ${loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} transition-colors duration-300`}
                >
                    {loading ? 'Adding...' : 'Add Travel'}
                </button>
            </form>
            <div className="text-center mt-6">
                <Link href="/admin-dashboard/travel/edit" className="text-green-400 hover:underline">Go to Edit Page</Link>
            </div>
        </div>
    );
}