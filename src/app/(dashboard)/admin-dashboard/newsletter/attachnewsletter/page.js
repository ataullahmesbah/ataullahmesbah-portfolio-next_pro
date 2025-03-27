// src/app/newsletter/add/page.js
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const AddNewsletterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'mainImage') {
            setFormData({ ...formData, mainImage: files[0] });
        } else if (name === 'gallery') {
            const newFiles = Array.from(files);
            setFormData({
                ...formData,
                gallery: newFiles,
                galleryNames: newFiles.map((_, index) => formData.galleryNames[index] || `Gallery Image ${index + 1}`),
                galleryAlts: newFiles.map((_, index) => formData.galleryAlts[index] || `Gallery image ${index + 1}`),
            });
        }
    };

    const handleGalleryNameChange = (index, value) => {
        const updatedNames = [...formData.galleryNames];
        updatedNames[index] = value;
        setFormData({ ...formData, galleryNames: updatedNames });
    };

    const handleGalleryAltChange = (index, value) => {
        const updatedAlts = [...formData.galleryAlts];
        updatedAlts[index] = value;
        setFormData({ ...formData, galleryAlts: updatedAlts });
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
        setIsSubmitting(true);

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('metaTitle', formData.metaTitle);
        formDataToSend.append('metaDescription', formData.metaDescription);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('imageAlt', formData.imageAlt);
        formDataToSend.append('author', formData.author);
        formDataToSend.append('mainImage', formData.mainImage);

        // Add content sections
        formData.contentSections.forEach((section) => {
            formDataToSend.append('contentSections', section.content);
            formDataToSend.append('tags', section.tag);
            formDataToSend.append('bulletPoints', section.bulletPoints);
        });

        // Add gallery images, names, and alts
        formData.gallery.forEach((file, index) => {
            formDataToSend.append('gallery', file);
            formDataToSend.append('galleryNames', formData.galleryNames[index] || `Gallery Image ${index + 1}`);
            formDataToSend.append('galleryAlts', formData.galleryAlts[index] || `Gallery image ${index + 1} for ${formData.title}`);
        });

        try {
            const res = await fetch('/api/newsletter/letter', {
                method: 'POST',
                body: formDataToSend,
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Newsletter added successfully');
                // Clear form fields
                setFormData({
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
                router.push('/newsletterinfo');
            } else {
                toast.error(data.error || 'Failed to add newsletter');
            }
        } catch (error) {
            toast.error('Error adding newsletter');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6 md:p-10">
            <Toaster position="top-center" />
            <h1 className="text-4xl font-normal tracking-tight text-shadow-md mb-10 text-center">
                Add New Newsletter
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
                    <label className="block text-gray-300 mb-2">Main Image</label>
                    <input
                        type="file"
                        name="mainImage"
                        onChange={handleFileChange}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
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
                    <label className="block text-gray-300 mb-2">Gallery Images (Optional)</label>
                    <input
                        type="file"
                        name="gallery"
                        multiple
                        onChange={handleFileChange}
                        className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {formData.gallery.length > 0 && (
                        <div className="mt-4 space-y-4">
                            {formData.gallery.map((file, index) => (
                                <div key={index} className="space-y-2">
                                    <p className="text-gray-400">File: {file.name}</p>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Gallery Image Name</label>
                                        <input
                                            type="text"
                                            value={formData.galleryNames[index] || `Gallery Image ${index + 1}`}
                                            onChange={(e) => handleGalleryNameChange(index, e.target.value)}
                                            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter gallery image name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Gallery Image Alt Text</label>
                                        <input
                                            type="text"
                                            value={formData.galleryAlts[index] || `Gallery image ${index + 1}`}
                                            onChange={(e) => handleGalleryAltChange(index, e.target.value)}
                                            className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter gallery image alt text"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                    disabled={isSubmitting}
                    className={`w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300 flex items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {isSubmitting ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 mr-3 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Submitting...
                        </>
                    ) : (
                        'Add Newsletter'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddNewsletterPage;