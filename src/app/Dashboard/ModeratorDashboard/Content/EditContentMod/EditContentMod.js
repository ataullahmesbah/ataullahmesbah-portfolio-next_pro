'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function EditContentMod() {
    const [form, setForm] = useState({ title: "", description: "", link: "", platform: "YouTube" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { slug } = useParams();

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/content`);
                const content = res.data.find(item => item.slug === slug);
                if (content) {
                    setForm({
                        title: content.title,
                        description: content.description,
                        link: content.link,
                        platform: content.platform,
                    });
                } else {
                    toast.error("Content not found");
                    router.push("/moderator-dashboard/content");
                }
            } catch (error) {
                toast.error("Failed to load content");
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchContent();
    }, [slug, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`/api/content/${slug}`, form);
            toast.success("Content updated successfully");
            router.push("/moderator-dashboard/content-creation/all-content");
        } catch (error) {
            toast.error("Error: " + (error.response?.data?.error || error.message));
            console.error("Update error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                Edit Content
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
                    {loading ? "Updating..." : "Update Content"}
                </button>
            </form>
        </div>
    );
}