'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AddContent() {
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
            router.push("/admin-dashboard/content");
        } catch (error) {
            toast.error("Error: " + error.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">Add New Content</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full p-2 mt-1 bg-gray-800 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full p-2 mt-1 bg-gray-800 rounded"
                        rows="4"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Video Link</label>
                    <input
                        type="url"
                        value={form.link}
                        onChange={e => setForm({ ...form, link: e.target.value })}
                        className="w-full p-2 mt-1 bg-gray-800 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Platform</label>
                    <select
                        value={form.platform}
                        onChange={e => setForm({ ...form, platform: e.target.value })}
                        className="w-full p-2 mt-1 bg-gray-800 rounded"
                    >
                        <option value="YouTube">YouTube</option>
                        <option value="Facebook">Facebook</option>
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
                >
                    {loading ? "Adding..." : "Add Content"}
                </button>
            </form>
        </div>
    );
}