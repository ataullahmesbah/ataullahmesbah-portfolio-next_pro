// src/app/newsletter/edit/[id]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const EditNewsletterPage = ({ params }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        id: params.id,
        title: '',
        metaTitle: '',
        metaDescription: '',
        description: '',
        contentSections: [{ content: '', tag: 'p', bulletPoints: '' }],
        category: '',
        mainImage: null,
        imageAlt: '',
        gallery: [],
        galleryNames: [],
        galleryAlts: [],
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
                    title: data.title,
                    metaTitle: data.metaTitle,
                    metaDescription: data.metaDescription,
                    description: data.description,
                    contentSections: data.content.map((section) => ({
                        content: section.content,
                        tag: section.tag,
                        bulletPoints: section.bulletPoints.join(', '),
                    })),
                    category: data.category,
                    mainImage: null,
                    imageAlt: data.imageAlt,
                    gallery: [],
                    galleryNames: data.gallery.map((item) => item.name),
                    galleryAlts: data.gallery.map((item) => item.alt),
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

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'mainImage') {
            setFormData({ ...formData, mainImage: files[0] });
        } else if (name === 'gallery') {
            setFormData({ ...formData, gallery: Array.from(files) });
        }
    };

    const handleContentSectionChange = (index, field, value) => {
        const updatedSections = [...formData.contentSections];
        updatedSections[index][field] = value;
        setFormData({ ...formData, contentSections: updatedSections });
    };

    const addContentSection = () => {
        setFormData({
            ...formData,
            contentSections: [...formData.contentSections, { content: '', tag: 'p', bulletPoints: '' }],
        });
    };

    const removeContentSection = (index) => {
        const updatedSections = formData.contentSections.filter((_, i) => i !== index);
        setFormData({ ...formData, contentSections: updatedSections });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('id', formData.id);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('metaTitle', formData.metaTitle);
        formDataToSend.append('metaDescription', formData.metaDescription);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('imageAlt', formData.imageAlt);
        formDataToSend.append('author', formData.author);
        if (formData.mainImage) {
            formDataToSend.append('mainImage', formData.mainImage);
        }

        // Add content sections
        formData.contentSections.forEach((section) => {
            formDataToSend.append('contentSections', section.content);
            formDataToSend.append('tags', section.tag);
            formDataToSend.append('bulletPoints', section.bulletPoints);
        });

        // Add gallery images
        formData.gallery.forEach((file) => {
            formDataToSend.append('gallery', file);
        });

        try {
            const res = await fetch('/api/newsletter/letter', {
                method: 'PUT',
                body: formDataToSend,
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Newsletter updated successfully');
                router.push('/newsletterinfo');
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
                    <label className="block text-gray-300 mb-2">Content Sections</label>
                    {formData.contentSections.map((section, index) => (
                        <div key={index} className="space-y-3 mb-4 p-4 bg-gray-800 rounded-lg">
                            <div>
                                <label className="block text-gray-300 mb-2">Content</label>
                                <textarea
                                    value={section.content}
                                    onChange={(e) => handleContentSectionChange(index, 'content', e.target.value)}
                                    className="w-full p-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter content"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Tag</label>
                                <select
                                    value={section.tag}
                                    onChange={(e) => handleContentSectionChange(index, 'tag', e.target.value)}
                                    className="w-full p-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="p">Paragraph</option>
                                    <option value="h1">H1</option>
                                    <option value="h2">H2</option>
                                    <option value="h3">H3</option>
                                    <option value="h4">H4</option>
                                    <option value="h5">H5</option>
                                    <option value="h6">H6</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-300 mb-2">Bullet Points (comma-separated, optional)</label>
                                <input
                                    type="text"
                                    value={section.bulletPoints}
                                    onChange={(e) => handleContentSectionChange(index, 'bulletPoints', e.target.value)}
                                    className="w-full p-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., point 1, point 2, point 3"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeContentSection(index)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                            >
                                Remove Section
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addContentSection}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                    >
                        Add Content Section
                    </button>
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
                    <label className="block text-gray-300 mb-2">Main Image (Leave empty to keep existing)</label>
                    <input
                        type="file"
                        name="mainImage"
                        onChange={handleFileChange}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Image Alt Text</label>
                    <input
                        type="text"
                        name="imageAlt"
                        value={formData.imageAlt}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter image alt text"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-2">Gallery Images (Optional, leave empty to keep existing)</label>
                    <input
                        type="file"
                        name="gallery"
                        multiple
                        onChange={handleFileChange}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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