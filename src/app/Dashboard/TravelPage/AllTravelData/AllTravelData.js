// app/admin-dashboard/travel/all-travel-data/page.js
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function AllTravelData() {
    const [travels, setTravels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTravels = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/travel');
            setTravels(res.data);
            toast.success('Data fetched successfully');
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTravels();
    }, []);

    const handleDelete = async (slug) => {
        if (confirm('Are you sure you want to delete this travel entry?')) {
            try {
                await axios.delete(`/api/travel/${slug}`);
                setTravels(travels.filter(t => t.slug !== slug));
                toast.success('Travel deleted successfully');
            } catch (error) {
                toast.error('Failed to delete travel');
            }
        }
    };

    const filteredTravels = travels
        .filter(t => categoryFilter === 'All' || t.category === categoryFilter)
        .filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-800 p-6">
            <h1 className="text-4xl font-bold text-white text-center mb-8">All Travel Data</h1>

            {/* Filter and Search */}
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 mb-8">
                <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="All">All Categories</option>
                    <option value="Journey">Journey</option>
                    <option value="Historical">Historical</option>
                    <option value="Gallery">Gallery</option>
                </select>
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500 flex-grow"
                />
                <button
                    onClick={fetchTravels}
                    className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                    Refresh
                </button>
            </div>

            {/* Travel Data Table */}
            <div className="max-w-4xl mx-auto bg-gray-700 rounded-xl shadow-lg p-6">
                <table className="w-full text-white">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTravels.map(travel => (
                            <tr key={travel._id} className="border-b border-gray-600 hover:bg-gray-600 transition-colors duration-200">
                                <td className="p-3">{travel.title}</td>
                                <td className="p-3">{travel.category}</td>
                                <td className="p-3 flex gap-2">
                                    <Link href={`/mesbahoffwego/${travel.slug}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                        View
                                    </Link>
                                    <Link href={`/admin-dashboard/travel/edit?slug=${travel.slug}`} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                                        Update
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(travel.slug)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}