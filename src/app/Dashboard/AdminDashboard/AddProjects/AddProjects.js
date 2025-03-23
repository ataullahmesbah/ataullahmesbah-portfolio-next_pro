// src/app/admin/projects/add/page.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProjectPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        contentSections: [{ content: '', tag: 'p', bulletPoints: [] }], // bulletPoints as an array
        category: 'Marketing',
        newCategory: '',
        keyPoints: [],
        websiteFeatures: [],
        supportSystem: '',
        metaDescription: '',
        imageAlt: '',
        mainImage: null,
        gallery: [],
        galleryNames: [],
        galleryAlts: [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'metaDescription' && value.length > 160) {
            return; // Limit metaDescription to 160 characters
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'mainImage') {
            setFormData((prev) => ({ ...prev, mainImage: files[0] }));
        } else if (name === 'gallery') {
            const newGallery = Array.from(files);
            setFormData((prev) => ({
                ...prev,
                gallery: [...prev.gallery, ...newGallery],
                galleryNames: [...prev.galleryNames, ...newGallery.map(() => '')],
                galleryAlts: [...prev.galleryAlts, ...newGallery.map(() => '')],
            }));
        }
    };

    const handleArrayInputChange = (e, field) => {
        const values = e.target.value.split(',').map(item => item.trim());
        setFormData((prev) => ({ ...prev, [field]: values }));
    };

    const handleContentSectionChange = (index, field, value) => {
        const updatedSections = [...formData.contentSections];
        if (field === 'bulletPoints') {
            // Split the string into an array of bullet points
            updatedSections[index][field] = value.split(',').map(item => item.trim());
        } else {
            updatedSections[index][field] = value;
        }
        setFormData((prev) => ({ ...prev, contentSections: updatedSections }));
    };

    const addContentSection = () => {
        setFormData((prev) => ({
            ...prev,
            contentSections: [...prev.contentSections, { content: '', tag: 'p', bulletPoints: '' }],
        }));
    };

    const handleGalleryMetaChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedArray = [...prev[field]];
            updatedArray[index] = value;
            return { ...prev, [field]: updatedArray };
        });
    };

    const addMoreImages = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.name = 'gallery';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = handleFileChange;
        input.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('description', formData.description);

        // Append content sections, tags, and bullet points
        formData.contentSections.forEach((section, index) => {
            data.append('contentSections', section.content);
            data.append('tags', section.tag);
            data.append('bulletPoints', section.bulletPoints.join(', ')); // Convert array to comma-separated string
        });

        data.append('category', formData.newCategory || formData.category);
        formData.keyPoints.forEach((point) => data.append('keyPoints', point));
        formData.websiteFeatures.forEach((feature) => data.append('websiteFeatures', feature));
        data.append('supportSystem', formData.supportSystem);
        data.append('metaDescription', formData.metaDescription);
        data.append('imageAlt', formData.imageAlt);
        if (formData.mainImage) data.append('mainImage', formData.mainImage);

        // Append gallery files, names, and alt texts
        formData.gallery.forEach((file, index) => {
            data.append('gallery', file);
            data.append('galleryNames', formData.galleryNames[index] || `Gallery Image ${index + 1}`);
            data.append('galleryAlts', formData.galleryAlts[index] || `Gallery image ${index + 1} for ${formData.title}`);
        });

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add project');
            }

            const result = await response.json();
            toast.success(result.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => router.push('/admin-dashboard/projects'), 3000);
        } catch (err) {
            console.error('Error adding project:', err);
            toast.error('Error: ' + err.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const predefinedCategories = ['Marketing', 'Ecommerce', 'Travel', 'Blog', 'Personal Portfolio', 'Other'];

    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">Add New Project</h1>
            <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-300">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300">Subtitle</label>
                        <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                            required
                        />
                    </div>
                    {/* Content Sections */}
                    <div>
                        <label className="block text-gray-300">Additional Content</label>
                        {formData.contentSections.map((section, index) => (
                            <div key={index} className="space-y-2 mb-4 p-4 bg-gray-700 rounded-lg">
                                <div>
                                    <label className="block text-gray-400">Tag</label>
                                    <select
                                        value={section.tag}
                                        onChange={(e) => handleContentSectionChange(index, 'tag', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-gray-600 text-white"
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
                                    <label className="block text-gray-400">Content for {section.tag.toUpperCase()} (SEO)</label>
                                    <textarea
                                        value={section.content}
                                        onChange={(e) => handleContentSectionChange(index, 'content', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-gray-600 text-white"
                                        placeholder={`Add content for ${section.tag.toUpperCase()} tag...`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400">Bullet Points (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={section.bulletPoints}
                                        onChange={(e) => handleContentSectionChange(index, 'bulletPoints', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-gray-600 text-white"
                                        placeholder="e.g. Point 1, Point 2"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addContentSection}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Add More Content
                        </button>
                    </div>
                    {/* Category */}
                    <div>
                        <label className="block text-gray-300">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                        >
                            {predefinedCategories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="mt-2">
                            <label className="block text-gray-300">Add New Category</label>
                            <input
                                type="text"
                                name="newCategory"
                                value={formData.newCategory}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-lg bg-gray-700 text-white"
                                placeholder="Enter new category (optional)"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-300">Meta Description (SEO, max 160 characters)</label>
                        <textarea
                            name="metaDescription"
                            value={formData.metaDescription}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                            required
                        />
                        <p className="text-gray-400 text-sm">
                            {formData.metaDescription.length}/160 characters
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-300">Main Image</label>
                        <input
                            type="file"
                            name="mainImage"
                            onChange={handleFileChange}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                            accept="image/*"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300">Main Image Alt Text (SEO)</label>
                        <input
                            type="text"
                            name="imageAlt"
                            value={formData.imageAlt}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300">Key Points (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.keyPoints.join(', ')}
                            onChange={(e) => handleArrayInputChange(e, 'keyPoints')}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                            placeholder="e.g. Feature 1, Feature 2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300">Website Features (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.websiteFeatures.join(', ')}
                            onChange={(e) => handleArrayInputChange(e, 'websiteFeatures')}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                            placeholder="e.g. Feature 1, Feature 2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300">Support System</label>
                        <input
                            type="text"
                            name="supportSystem"
                            value={formData.supportSystem}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300">Gallery Images</label>
                        <input
                            type="file"
                            name="gallery"
                            onChange={handleFileChange}
                            className="w-full p-2 rounded-lg bg-gray-700 text-white"
                            accept="image/*"
                            multiple
                        />
                        <button
                            type="button"
                            onClick={addMoreImages}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Add More Images
                        </button>
                    </div>
                    {/* Gallery Names and Alts */}
                    {formData.gallery.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-gray-300">Gallery Image Details</h3>
                            {formData.gallery.map((_, index) => (
                                <div key={index} className="space-y-1">
                                    <label className="block text-gray-400">Image {index + 1} Name</label>
                                    <input
                                        type="text"
                                        value={formData.galleryNames[index] || ''}
                                        onChange={(e) => handleGalleryMetaChange(index, 'galleryNames', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-gray-700 text-white"
                                        placeholder={`Gallery Image ${index + 1}`}
                                    />
                                    <label className="block text-gray-400">Image {index + 1} Alt Text (SEO)</label>
                                    <input
                                        type="text"
                                        value={formData.galleryAlts[index] || ''}
                                        onChange={(e) => handleGalleryMetaChange(index, 'galleryAlts', e.target.value)}
                                        className="w-full p-2 rounded-lg bg-gray-700 text-white"
                                        placeholder={`Gallery image ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Add Project
                    </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddProjectPage;