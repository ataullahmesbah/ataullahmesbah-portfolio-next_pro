// src/app/newsletter/edit/[id]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const EditNewsLetterMod = ({ params }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        id: params.id,
        title: '',
        metaTitle: '',
        metaDescription: '',
        description: '',
        contentSections: [{ content: '', tag: 'p', bulletPoints: [] }],
        category: '',
        categories: [], // For suggestions
        mainImage: null,
        imageAlt: '',
        author: session?.user?.name || '',
        existingImage: ''
    });
    const [loading, setLoading] = useState(true);

    // Fetch existing categories for suggestions
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/newsletter/categories');
                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({ ...prev, categories: data }));
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Update author when session loads
    useEffect(() => {
        if (session?.user?.name) {
            setFormData(prev => ({
                ...prev,
                author: session.user.name
            }));
        }
    }, [session]);

    // Fetch newsletter data
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
                    contentSections: data.content.map(section => ({
                        content: section.content,
                        tag: section.tag,
                        bulletPoints: section.bulletPoints || []
                    })),
                    category: data.category,
                    categories: formData.categories,
                    mainImage: null,
                    imageAlt: data.imageAlt,
                    author: data.author,
                    existingImage: data.mainImage
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
        if (e.target.name === 'mainImage') {
            setFormData({ ...formData, mainImage: e.target.files[0] });
        }
    };

    const handleContentSectionChange = (index, field, value) => {
        const updatedSections = [...formData.contentSections];

        if (field === 'bulletPoints') {
            // Split by comma and trim whitespace, filter out empty strings
            const points = value.split(',')
                .map(point => point.trim())
                .filter(point => point.length > 0);
            updatedSections[index][field] = points;
        } else {
            updatedSections[index][field] = value;
        }

        setFormData({ ...formData, contentSections: updatedSections });
    };

    const addContentSection = () => {
        setFormData({
            ...formData,
            contentSections: [...formData.contentSections, { content: '', tag: 'p', bulletPoints: [] }],
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
        formDataToSend.append('contentSections', JSON.stringify(formData.contentSections));
        formDataToSend.append('category', formData.category);
        formDataToSend.append('imageAlt', formData.imageAlt);
        formDataToSend.append('author', formData.author);
        if (formData.mainImage) {
            formDataToSend.append('mainImage', formData.mainImage);
        }

        try {
            const res = await fetch('/api/newsletter/letter', {
                method: 'PUT',
                body: formDataToSend,
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Newsletter updated successfully');
                router.push('/moderator-dashboard/newsletter/all-letter');
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-4 md:p-6 lg:p-8">
            <Toaster position="top-center" />
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                        Edit Newsletter
                    </h1>
                    <button
                        onClick={() => router.back()}
                        className="text-gray-400 hover:text-white flex items-center text-sm"
                    >
                        ← Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                            <label className="block text-gray-300 mb-2 text-sm font-medium">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter title"
                                required
                            />
                        </div>

                        {/* Category with suggestions */}
                        <div>
                            <label className="block text-gray-300 mb-2 text-sm font-medium">Category *</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    list="categorySuggestions"
                                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Select or enter new category"
                                    required
                                />
                                <datalist id="categorySuggestions">
                                    {formData.categories.map((cat, index) => (
                                        <option key={index} value={cat} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        {/* Meta Title */}
                        <div>
                            <label className="block text-gray-300 mb-2 text-sm font-medium">Meta Title *</label>
                            <input
                                type="text"
                                name="metaTitle"
                                value={formData.metaTitle}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter meta title"
                                required
                            />


                        </div>

                        {/* Author */}
                        <div>
                            <label className="block text-gray-300 mb-2 text-sm font-medium">Author *</label>
                            <input
                                type="text"
                                name="author"
                                value={session?.user?.name || ''}
                                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-not-allowed"
                                readOnly
                                disabled
                            />
                        </div>
                    </div>

                    {/* Meta Description */}
                    <div>
                        <label className="block text-gray-300 mb-2 text-sm font-medium">Meta Description *</label>
                        <textarea
                            name="metaDescription"
                            value={formData.metaDescription}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter meta description (max 160 characters)"
                            rows="3"
                            maxLength="160"
                            required
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                            {formData.metaDescription.length}/160 characters
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-300 mb-2 text-sm font-medium">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter description"
                            rows="4"
                            required
                        />
                    </div>

                    {/* Image Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Main Image */}
                        <div>
                            <label className="block text-gray-300 mb-2 text-sm font-medium">Main Image</label>
                            <div className="border-2 border-dashed border-gray-700 rounded-lg p-4">
                                {formData.existingImage && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-400 mb-2">Current Image:</p>
                                        <div className="relative aspect-video rounded-lg overflow-hidden">
                                            <img
                                                src={formData.existingImage}
                                                alt="Current newsletter"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="mainImage"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-400
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-purple-600 file:text-white
                                    hover:file:bg-purple-700"
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    Leave empty to keep existing image
                                </p>
                            </div>
                        </div>

                        {/* Image Alt Text */}
                        <div>
                            <label className="block text-gray-300 mb-2 text-sm font-medium">Image Alt Text *</label>
                            <input
                                type="text"
                                name="imageAlt"
                                value={formData.imageAlt}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Describe the image for accessibility"
                                required
                            />
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-6">
                        <label className="block text-gray-300 text-sm font-medium">Content Sections</label>

                        {formData.contentSections.map((section, index) => (
                            <div key={index} className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-300">Section {index + 1}</h3>
                                    {formData.contentSections.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeContentSection(index)}
                                            className="text-red-500 hover:text-red-400 text-sm flex items-center"
                                        >
                                            Remove Section
                                        </button>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="mb-4">
                                    <label className="block text-gray-300 mb-2 text-sm">Content *</label>
                                    <textarea
                                        value={section.content}
                                        onChange={(e) => handleContentSectionChange(index, 'content', e.target.value)}
                                        className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter your content here"
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Tag Selection */}
                                    <div>
                                        <label className="block text-gray-300 mb-2 text-sm">Content Type *</label>
                                        <select
                                            value={section.tag}
                                            onChange={(e) => handleContentSectionChange(index, 'tag', e.target.value)}
                                            className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="p">Paragraph</option>
                                            <option value="h1">Heading 1</option>
                                            <option value="h2">Heading 2</option>
                                            <option value="h3">Heading 3</option>
                                            <option value="h4">Heading 4</option>
                                            <option value="h5">Heading 5</option>
                                            <option value="h6">Heading 6</option>
                                        </select>
                                    </div>

                                    {/* Bullet Points (Optional) */}
                                    <div>
                                        <label className="block text-gray-300 mb-2 text-sm">Bullet Points (Optional)</label>
                                        <input
                                            type="text"
                                            value={section.bulletPoints.join(', ')}
                                            onChange={(e) => handleContentSectionChange(index, 'bulletPoints', e.target.value)}
                                            className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Comma separated points"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Leave empty if not needed</p>
                                    </div>
                                </div>

                                {/* Display bullet points only if they exist */}
                                {section.bulletPoints.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-300 mb-2">Preview Bullet Points:</h4>
                                        <ul className="list-disc pl-5 space-y-1 text-gray-300">
                                            {section.bulletPoints.map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addContentSection}
                            className="flex items-center text-purple-400 hover:text-purple-300 text-sm"
                        >
                            <span className="mr-1">+</span> Add Another Content Section
                        </button>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-medium text-white hover:from-green-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
                        >
                            Update Newsletter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditNewsLetterMod;