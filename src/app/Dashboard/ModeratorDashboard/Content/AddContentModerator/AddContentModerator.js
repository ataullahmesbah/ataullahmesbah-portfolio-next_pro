'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AddContentMod() {
    const [form, setForm] = useState({ title: "", description: "", link: "", platform: "YouTube" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post("/api/content", form);
            toast.success("Content added successfully");
            setForm({ title: "", description: "", link: "", platform: "YouTube" });
            router.push("/moderator-dashboard/content-creation/all-content");
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.error || error.message));
            console.error("Add error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                Add New Content
            </h1>
            {loading && <div className="text-center text-gray-400 mb-4">Loading...</div>}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full p-3 mt-1 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full p-3 mt-1 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                        rows="4"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Video Link</label>
                    <input
                        type="url"
                        value={form.link}
                        onChange={e => setForm({ ...form, link: e.target.value })}
                        className="w-full p-3 mt-1 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Platform</label>
                    <select
                        value={form.platform}
                        onChange={e => setForm({ ...form, platform: e.target.value })}
                        className="w-full p-3 mt-1 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                    >
                        <option value="YouTube">YouTube</option>
                        <option value="Facebook">Facebook</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {loading ? "Adding..." : "Add Content"}
                </button>
            </form>
        </div>
    );
}