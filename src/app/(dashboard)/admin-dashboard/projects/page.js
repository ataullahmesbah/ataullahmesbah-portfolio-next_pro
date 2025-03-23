// src/app/admin/projects/page.js
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageProjectsPage = () => {
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        contentSections: [{ content: '', tag: 'p', bulletPoints: '' }],
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

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                setProjects(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'metaDescription' && value.length > 160) {
            return;
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
        updatedSections[index][field] = value;
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

    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            subtitle: project.subtitle,
            description: project.description,
            contentSections: project.content && project.content.length > 0
                ? project.content.map(section => ({
                    content: section.content,
                    tag: section.tag,
                    bulletPoints: section.bulletPoints ? section.bulletPoints.join(', ') : '',
                }))
                : [{ content: '', tag: 'p', bulletPoints: '' }],
            category: project.category,
            newCategory: '',
            keyPoints: project.keyPoints || [],
            websiteFeatures: project.websiteFeatures || [],
            supportSystem: project.supportSystem || '',
            metaDescription: project.metaDescription,
            imageAlt: project.imageAlt,
            mainImage: null,
            gallery: [],
            galleryNames: [],
            galleryAlts: [],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('description', formData.description);
        formData.contentSections.forEach((section) => {
            data.append('contentSections', section.content);
            data.append('tags', section.tag);
            data.append('bulletPoints', section.bulletPoints);
        });
        data.append('category', formData.newCategory || formData.category);
        formData.keyPoints.forEach((point) => data.append('keyPoints', point));
        formData.websiteFeatures.forEach((feature) => data.append('websiteFeatures', feature));
        data.append('supportSystem', formData.supportSystem);
        data.append('metaDescription', formData.metaDescription);
        data.append('imageAlt', formData.imageAlt);
        if (formData.mainImage) data.append('mainImage', formData.mainImage);
        formData.gallery.forEach((file) => data.append('gallery', file));
        formData.galleryNames.forEach((name) => data.append('galleryNames', name));
        formData.galleryAlts.forEach((alt) => data.append('galleryAlts', alt));

        try {
            const response = await fetch(`/api/projects/${editingProject._id}`, {
                method: 'PUT',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update project');
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

            // Refresh projects list
            const updatedProjects = await fetch('/api/projects').then(res => res.json());
            setProjects(updatedProjects);

            // Reset form
            setFormData({
                title: '',
                subtitle: '',
                description: '',
                contentSections: [{ content: '', tag: 'p', bulletPoints: '' }],
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
            setEditingProject(null);
        } catch (err) {
            console.error('Error updating project:', err);
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

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete project');
            const result = await response.json();
            toast.success(result.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setProjects(projects.filter(project => project._id !== id));
        } catch (err) {
            console.error('Error deleting project:', err);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg text-center">
                Error: {error}
            </div>
        );
    }

    const predefinedCategories = ['Marketing', 'Ecommerce', 'Travel', 'Blog', 'Personal Portfolio', 'Other'];

    return (
        <div className="bg-gray-900 min-h-screen p-6">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">Manage Projects</h1>
            <div className="text-center mb-8">
                <Link href="/admin-dashboard/projects/add">
                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                        Add New Project
                    </button>
                </Link>
            </div>

            {/* Edit Project Form */}
            {editingProject && (
                <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-4">Edit Project</h2>
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
                            <label className="block text-gray-300">Main Image (Leave empty to keep existing)</label>
                            <input
                                type="file"
                                name="mainImage"
                                onChange={handleFileChange}
                                className="w-full p-2 rounded-lg bg-gray-700 text-white"
                                accept="image/*"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300">Gallery Images (Leave empty to keep existing)</label>
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
                            Update Project
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setEditingProject(null);
                                setFormData({
                                    title: '',
                                    subtitle: '',
                                    description: '',
                                    contentSections: [{ content: '', tag: 'p', bulletPoints: '' }],
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
                            }}
                            className="w-full px-4 py-2 mt-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                            Cancel Edit
                        </button>
                    </form>
                </div>
            )}

            {/* Projects List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="bg-gray-800 rounded-lg shadow-lg p-4">
                        <h2 className="text-xl font-semibold text-white">{project.title}</h2>
                        <p className="text-gray-400">{project.category}</p>
                        <p className="text-gray-400">Views: {(project.views || 0).toLocaleString()}</p>
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={() => handleEdit(project)}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(project._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                            <Link href={`/projects/${project.slug}`}>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                    View
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <ToastContainer />
        </div>
    );
};

export default ManageProjectsPage;