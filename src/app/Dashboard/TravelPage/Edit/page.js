// src/app/admin/edit/page.js

// app/admin-dashboard/travel/edit/page.js
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function EditTravel() {
    const [travels, setTravels] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', location: '', category: '', image: null });
    const [editSlug, setEditSlug] = useState('');
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false); // Separate loading for update
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSlug = searchParams.get('slug');
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

    useEffect(() => {
        const fetchTravels = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/travel');
                setTravels(res.data);
                toast.success('Travel data loaded');
                // Pre-fill form if slug is provided in URL
                if (initialSlug) {
                    const travel = res.data.find(t => t.slug === initialSlug);
                    if (travel) {
                        setForm({ title: travel.title, description: travel.description, location: travel.location, category: travel.category, image: null });
                        setEditSlug(initialSlug);
                    }
                }
            } catch (error) {
                toast.error('Failed to load travel data');
            } finally {
                setLoading(false);
            }
        };
        fetchTravels();
    }, [initialSlug]);

    const handleEdit = (travel) => {
        setForm({ title: travel.title, description: travel.description, location: travel.location, category: travel.category, image: null });
        setEditSlug(travel.slug);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (updateLoading) return; // Prevent double submission
        setUpdateLoading(true);
        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));

        try {
            const res = await axios.put(`/api/travel/${editSlug}`, formData);
            toast.success('Travel updated successfully');
            setForm({ title: '', description: '', location: '', category: '', image: null });
            setEditSlug('');
            setTravels(travels.map(t => t.slug === editSlug ? res.data : t));
            router.push('/admin-dashboard/travel/all-travel-data');
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.error || 'Update failed'}`);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleFileChange = (e) => setForm({ ...form, image: e.target.files[0] });

    if (loading && !editSlug) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-800 p-6">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Edit Travel Entries</h1>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-700 p-6 rounded-xl shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Select Travel to Edit</h2>
                    <ul className="space-y-4">
                        {travels.map(travel => (
                            <li key={travel._id} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors">
                                <span className="text-white">{travel.title} ({travel.category})</span>
                                <button onClick={() => handleEdit(travel)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                    Edit
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {editSlug && (
                    <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded-xl shadow-2xl transform hover:shadow-3xl transition-shadow duration-300">

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
                                    New URL Slug: {slugPreview}
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
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full p-3 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="Journey">Journey</option>
                                <option value="Historical">Historical</option>
                                <option value="Gallery">Gallery</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block text-white font-semibold mb-2">Image (optional) 1200*628 PX</label>
                            <input type="file" onChange={handleFileChange} className="w-full p-3 text-white" accept="image/*" />
                        </div>
                        <button
                            type="submit"
                            disabled={updateLoading}
                            className={`w-full p-3 rounded-lg text-white ${updateLoading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} transition-colors duration-300`}
                        >
                            {updateLoading ? 'Updating...' : 'Update Travel'}
                        </button>
                    </form>
                )}
            </div>
            <div className="text-center mt-6">
                <Link href="/admin-dashboard/travel/add" className="text-green-400 hover:underline">Back to Add Travel</Link>
            </div>
        </div>
    );
}