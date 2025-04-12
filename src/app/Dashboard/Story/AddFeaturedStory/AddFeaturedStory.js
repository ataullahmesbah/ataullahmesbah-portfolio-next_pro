'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function AddFeaturedStory() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        metaDescription: '',
        description: '',
        content: [{ type: 'text', value: '', caption: '' }],
        image: null,
        category: 'featured',
        tags: '',
        metaTitle: '',
        keyPoints: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session) {
            toast.error('You must be logged in to submit a story');
            return;
        }

        setLoading(true);
        const formDataToSend = new FormData();
        
        // Append all fields
        formDataToSend.append('title', formData.title);
        formDataToSend.append('metaDescription', formData.metaDescription);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('content', JSON.stringify(formData.content));
        if (formData.image) formDataToSend.append('image', formData.image);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('tags', formData.tags);
        formDataToSend.append('metaTitle', formData.metaTitle);
        formDataToSend.append('keyPoints', formData.keyPoints);

        try {
            const response = await fetch('/api/feature', {
                method: 'POST',
                body: formDataToSend
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create story');
            }

            toast.success('Story created successfully!');
            router.push('/featured-stories');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (index, field, value) => {
        const newContent = [...formData.content];
        newContent[index][field] = value;
        setFormData((prev) => ({ ...prev, content: newContent }));
    };

    const addContentBlock = () => {
        setFormData((prev) => ({
            ...prev,
            content: [...prev.content, { type: 'text', value: '', caption: '' }],
        }));
    };

    const handleImageChange = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    return (
        <div className="min-h-screen bg-gray-800 py-12 px-4">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">Add Featured Story</h1>
                <form onSubmit={handleSubmit} className="bg-gray-700 p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-600 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="metaTitle">Meta Title</label>
                        <input
                            type="text"
                            id="metaTitle"
                            name="metaTitle"
                            value={formData.metaTitle}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-600 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="metaDescription">Meta Description</label>
                        <textarea
                            id="metaDescription"
                            name="metaDescription"
                            value={formData.metaDescription}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-600 text-white"
                            rows="4"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-600 text-white"
                            rows="4"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2">Content Blocks</label>
                        {formData.content.map((block, index) => (
                            <div key={index} className="mb-4 border-t border-gray-600 pt-4">
                                <select
                                    value={block.type}
                                    onChange={(e) => handleContentChange(index, 'type', e.target.value)}
                                    className="w-full p-2 rounded bg-gray-600 text-white mb-2"
                                >
                                    <option value="text">Text</option>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                    <option value="code">Code</option>
                                </select>
                                <textarea
                                    value={block.value}
                                    onChange={(e) => handleContentChange(index, 'value', e.target.value)}
                                    className="w-full p-2 rounded bg-gray-600 text-white"
                                    rows="4"
                                    placeholder={block.type === 'text' ? 'Enter text' : 'Enter URL or content'}
                                    required
                                />
                                <input
                                    type="text"
                                    value={block.caption}
                                    onChange={(e) => handleContentChange(index, 'caption', e.target.value)}
                                    className="w-full p-2 rounded bg-gray-600 text-white mt-2"
                                    placeholder="Caption (optional)"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addContentBlock}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Add Content Block
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="image">Image</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-2 rounded bg-gray-600 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-600 text-white"
                        >
                            <option value="featured">Featured</option>
                            <option value="tech">Tech</option>
                            <option value="travel">Travel</option>
                            <option value="seo">SEO</option>
                            <option value="personal">Personal</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="tag">Tags (comma-separated)</label>
                        <input
                            type="text"
                            id="tag"
                            name="tag"
                            value={formData.tag}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-600 text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="author">Author</label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-600 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white mb-2" htmlFor="keypoint">Key Points (comma-separated)</label>
                        <input
                            type="text"
                            id="keypoint"
                            name="keypoint"
                            value={formData.keypoint}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-600 text-white"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Story'}
                    </button>
                </form>
            </div>
        </div>
    );
}