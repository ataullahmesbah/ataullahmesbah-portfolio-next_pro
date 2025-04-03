// app/admin-dashboard/travel/add/page.js

"use client";
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function AddTravel() {
    const [form, setForm] = useState({ title: '', description: '', location: '', category: 'Journey', image: null });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));

        try {
            await axios.post('/api/travel/new', formData);
            toast.success('Travel added/updated successfully');
            setForm({ title: '', description: '', location: '', category: 'Journey', image: null });
        } catch (error) {
            toast.error('Error: ' + error.response?.data?.error);
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
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
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
                        onChange={e => setForm({ ...form, category: e.target.value })}
                        className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="Journey">Journey</option>
                        <option value="Historical">Historical</option>
                        <option value="Gallery">Gallery</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-white font-semibold mb-2">Image</label>
                    <input type="file" onChange={handleFileChange} className="w-full p-3 text-white" accept="image/*" required />
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